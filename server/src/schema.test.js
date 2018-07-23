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
  mutation SignUp($input: SignupInput!){
    signup(input: $input) {
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

  const mockSchema = makeExecutableSchema({
    typeDefs,
    resolverValidationOptions: { requireResolversForResolveType: false },
  });
  addMockFunctionsToSchema({ schema: mockSchema, mocks });
  let variables;
  beforeEach(() => {
    variables = {
      input: {
        firstName: 'John',
        lastName: 'Smith',
        password: 'password',
        email: 'example@example.com',
      },
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
    let input;
    beforeEach(() => {
      input = variables.input;
    });
    describe('firstName', () => {
      it('has errors', () => {
        input.firstName = null;
        return expect(
          graphql(mockSchema, query, null, {}, variables)
        ).resolves.toHaveProperty('errors');
      });
    });
    describe('lastName', () => {
      it('has errors', () => {
        input.lastName = null;
        return expect(
          graphql(mockSchema, query, null, {}, variables)
        ).resolves.toHaveProperty('errors');
      });
    });
    describe('password', () => {
      it('has errors', () => {
        input.password = null;
        return expect(
          graphql(mockSchema, query, null, {}, variables)
        ).resolves.toHaveProperty('errors');
      });
    });
    describe('email', () => {
      it('has errors', () => {
        input.email = null;
        return expect(
          graphql(mockSchema, query, null, {}, variables)
        ).resolves.toHaveProperty('errors');
      });
    });
  });
});
