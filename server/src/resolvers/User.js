function chatRooms(parent, args, context, info) {
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
