const bcrypt = require('bcryptjs');

async function signup(parent, args, context, info) {
  const { db } = context;
  args.password = await bcrypt.hash(args.password, 10);
  return db.mutation.createUser({ data: { ...args } }, info);
}

async function signin(parent, args, context, info) {
  const { db, req } = context;
  const { email, password } = args;
  const user = await db.query.user({ where: { email } });
  const valid = bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Wrong email/password');
  req.session.userId = user.id;
  return user;
}

function createChatRoom(parent, args, context, info) {
  return context.db.mutation.createChatRoom(
    {
      data: {
        ...args,
        users: { connect: { id: [context.user.id] } },
      },
    },
    info
  );
}

function sendMessage(parents, args, context, info) {
  return context.db.mutation.createMessage(
    {
      data: {
        body: args.body,
        author: { connect: { id: context.user.id } },
        chatRoom: { connect: { id: args.chatRoomId } },
      },
    },
    info
  );
}

module.exports = {
  signup,
  signin,
  createChatRoom,
  sendMessage,
};
