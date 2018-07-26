require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const resolvers = require('./resolvers');
const directiveResolvers = require('./directives');
const sessionMiddleware = require('./middleware/session-middleware');
const authMiddleware = require('./middleware/auth-middleware');
const subscriptionAuth = require('./utils/user-from-websocket');
const PRISMA_ENDPOINT = process.env.PRISMA_ENDPOINT;
const PRISMA_SECRET = process.env.PRISMA_SECRET;

const db = new Prisma({
  typeDefs: './src/generated/prisma.graphql',
  endpoint: PRISMA_ENDPOINT,
  secret: PRISMA_SECRET,
  debug: true,
});

const server = new GraphQLServer({
  debug: true,
  typeDefs: './src//schema.graphql',
  resolvers,
  schemaDirectives: { ...directiveResolvers },
  context: ({ request, connection }) => {
    if (connection && connection.context.user) {
      return {
        db,
        req: request,
        user: connection.context.user,
      };
    }
    return {
      db,
      req: request,
    };
  },
});

server.express.use(
  server.options.endpoint,
  sessionMiddleware,
  authMiddleware(db, server)
);

const redisClient = require('./utils/RedisClient')();
server.start(
  {
    subscriptions: {
      onConnect: subscriptionAuth(db),
    },
  },
  () =>
    // eslint-disable-next-line
    console.log("server is now running on 'http://localhost:4000'")
);
