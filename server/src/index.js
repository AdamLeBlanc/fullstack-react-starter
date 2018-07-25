require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const nodeCookie = require('node-cookie');
const { promisify } = require('util');
const redis = require('redis');
const resolvers = require('./resolvers');
const directiveResolvers = require('./directives');
const sessionMiddleware = require('./middleware/session-middleware');
const authMiddleware = require('./middleware/auth-middleware');
const PRISMA_ENDPOINT = process.env.PRISMA_ENDPOINT;
const PRISMA_SECRET = process.env.PRISMA_SECRET;

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

redisClient.asyncGet = promisify(redisClient.get);

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
  context: async ({ request, connection }) => {
    if (connection.context.user) {
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

server.start(
  {
    subscriptions: {
      onConnect: async (connectionParams, webSocket) => {
        const cookie = nodeCookie.parse(webSocket.upgradeReq, 'shhhhhhh');
        const session = await JSON.parse(
          await redisClient.asyncGet(`sess:${cookie['connect.sid']}`)
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
