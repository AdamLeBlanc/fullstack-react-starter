const { importSchema } = require('graphql-import');
const {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} = require('graphql-tools');
const { graphql } = require('graphql');

const typeDefs = importSchema('./src/schema.graphql');

const mocks = {
  User: () => ({
    id: () => '1',
    firstName: () => 'John',
    lastName: () => 'LeBlanc',
    email: () => 'example@example.com',
    password: () => 'password',
    chatRooms: () => [],
  }),
};

describe('User Signup Mutation', () => {
  const query = `
  mutation SignUp($FirstName: String! $LastName: String! $Email: String! $Password: String!){
    signup(firstName: $FirstName, lastName: $LastName, email: $Email password: $Password) {
      id
      firstName
      lastName
      email
      chatRooms {
        name
      }
    }
  }
`;

  const mockSchema = makeExecutableSchema({ typeDefs });
  addMockFunctionsToSchema({ schema: mockSchema, mocks });
  var variables;
  beforeEach(() => {
    variables = {
      FirstName: 'John',
      LastName: 'Smith',
      Password: 'password',
      Email: 'example@example.com',
    };
  });
  describe('All Fields Submited', () => {
    it('should return the query', () => {
      const expexted = {
        data: {
          signup: {
            firstName: mocks.User().firstName(),
            lastName: mocks.User().lastName(),
            email: mocks.User().email(),
            id: mocks.User().id(),
            chatRooms: mocks.User().chatRooms(),
          },
        },
      };
      return expect(
        graphql(mockSchema, query, null, {}, variables)
      ).resolves.toEqual(expexted);
    });
  });

  describe('Missing', () => {
    describe('firstName', () => {
      it('has errors', () => {
        variables.FirstName = null;
        return expect(
          graphql(mockSchema, query, null, {}, variables)
        ).resolves.toHaveProperty('errors');
      });
    });
    describe('lastName', () => {
      it('has errors', () => {
        variables.LastName = null;
        return expect(
          graphql(mockSchema, query, null, {}, variables)
        ).resolves.toHaveProperty('errors');
      });
    });
    describe('password', () => {
      it('has errors', () => {
        variables.Password = null;
        return expect(
          graphql(mockSchema, query, null, {}, variables)
        ).resolves.toHaveProperty('errors');
      });
    });
    describe('email', () => {
      it('has errors', () => {
        variables.Email = null;
        return expect(
          graphql(mockSchema, query, null, {}, variables)
        ).resolves.toHaveProperty('errors');
      });
    });
  });
});
