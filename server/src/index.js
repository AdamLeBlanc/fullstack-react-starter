require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const nodeCookie = require('node-cookie');
const resolvers = require('./resolvers');
const directiveResolvers = require('./directives');
const sessionMiddleware = require('./middleware/session-middleware');
const authMiddleware = require('./middleware/auth-middleware');
const PRISMA_ENDPOINT = process.env.PRISMA_ENDPOINT;
const PRISMA_SECRET = process.env.PRISMA_SECRET;

const db = new Prisma({
  typeDefs: './src/generated/prisma.graphql',
  endpoint: PRISMA_ENDPOINT,
  secret: PRISMA_SECRET,
  debug: true,
});

const server = new GraphQLServer({
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
      onConnect: async (connectionParams, webSocket) => {
        const cookie = nodeCookie.parse(webSocket.upgradeReq, 'shhhhhhh');
        const session = await JSON.parse(
          await redisClient.getAsync(`sess:${cookie['connect.sid']}`)
        );
        if (!session) throw new Error('Authentication required');
        const user = db.query.user({ where: { id: session.userId } });
        if (!user) throw new Error('Authentication Required');
        return {
          user: user,
        };
      },
    },
  },
  () =>
    // eslint-disable-next-line
    console.log("server is now running on 'http://localhost:4000'")
);
