function user(parent, args, context, info) {
  context.db.query.user({ where: { id: args.id } });
}

module.exports = {
  user,
};
