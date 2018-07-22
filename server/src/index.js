require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga');

const typeDefs = `
  type Query {
    info: String!
  }
`;

const server = new GraphQLServer({
  typeDefs,
  resolvers: {
    Query: {
      info: () => 'Starter Server',
    },
  },
});

server.start(() =>
  // eslint-disable-next-line
  console.log("server is now running on 'http://localhost:4000'")
);
