require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
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
  context: req => ({
    db,
    req: req.request,
  }),
});

server.express.use(
  server.options.endpoint,
  sessionMiddleware,
  authMiddleware(db, server)
);

server.start(() =>
  // eslint-disable-next-line
  console.log("server is now running on 'http://localhost:4000'")
);
