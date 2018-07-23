function chatRooms(parent, args, context, info) {
  console.log('hello from chat', context.user.id);
  return context.db.query.chatRooms(
    {
      where: { users_every: { id: context.user.id } },
    },
    info
  );
}

module.exports = {
  chatRooms,
};
