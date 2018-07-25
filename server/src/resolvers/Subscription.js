/* eslint-disable camelcase */

function newMessagesSubscribe(parent, args, context, info) {
  return context.db.subscription.message(
    {
      where: {
        node: { chatRoom: { users_some: { id: context.user.id } } },
      },
    },
    info
  );
}

const newMessage = {
  subscribe: newMessagesSubscribe,
};

module.exports = {
  newMessage,
};
