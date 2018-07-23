const { signup } = require('../Mutation');
const bcrypt = require('bcryptjs');

const password = 'password';
let encryptedPassword;
bcrypt.hash(password, 10).then(r => (encryptedPassword = r));

const mockUser = {
  id: '1',
  firstName: 'john',
  lastName: 'scott',
  email: 'myemail@example.com',
  password: encryptedPassword,
  chatRooms: [],
};

describe('Mutation', () => {
  let context;
  beforeEach(() => {
    const db = {
      mutation: {
        createUser: jest.fn(),
      },
    };
    db.mutation.createUser.mockReturnValue({
      ...mockUser,
      password: undefined,
    });
  });
  describe('signup', () => {
    describe('Valid Fields', () => {
      it('returns the user', () => {
        const user = signup(null, {
          input: { ...mockUser, password: password, id: null, chatRooms: null },
        });
        expect(user).resolves.toEqual({ ...mockUser, password: null });
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
