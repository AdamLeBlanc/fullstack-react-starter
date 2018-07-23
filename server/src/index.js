require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const session = require('express-session');
const resolvers = require('./resolvers');

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
  context: req => ({
    db,
    req: req.request,
  }),
});

server.express.use(
  server.options.endpoint,
  session({
    secret: 'shhhhhhh',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 7,
      sameSite: true,
    },
  })
);

server.express.use(server.options.endpoint, async (req, res, next) => {
  console.log(req.sessio);
  if (!req.session.userId) {
    return next();
  }

  const user = await db.query.user({
    where: { id: req.session.userId },
  });

  if (user) {
    const old = server.context;
    server.context = req => ({
      ...old(req),
      user,
    });
  }
  next();
});

server.start(() =>
  // eslint-disable-next-line
  console.log("server is now running on 'http://localhost:4000'")
);
