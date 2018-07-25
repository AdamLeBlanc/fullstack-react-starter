const bcrypt = require('bcryptjs');

async function signup(parent, { input }, context, info) {
  const { db } = context;
  input.password = await bcrypt.hash(input.password, 10);
  return db.mutation.createUser({ data: { ...input } }, info);
}

async function signin(parent, args, context) {
  const { db, req } = context;
  const {
    input: { email, password },
  } = args;
  const user = await db.query.user({ where: { email } });
  const valid = user ? bcrypt.compare(password, user.password) : false;
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
  const { body, chatRoomId } = args.input;
  return context.db.mutation.createMessage(
    {
      data: {
        body: body,
        author: { connect: { id: context.user.id } },
        chatRoom: { connect: { id: chatRoomId } },
      },
    },
    info
  );
}

function joinChatRoom(preant, args, context, info) {
  return context.db.mutation.updateChatRoom(
    {
      where: { id: args.chatRoomId },
      data: { users: { connect: { id: context.user.id } } },
    },
    info
  );
}

function leaveChatRoom(parent, args, context) {
  return context.db.mutation.updateUser({
    where: { id: context.user.id },
    data: { chatRooms: { disconnect: { id: args.chatRoomId } } },
  });
}

module.exports = {
  signup,
  signin,
  createChatRoom,
  sendMessage,
  joinChatRoom,
  leaveChatRoom,
};
