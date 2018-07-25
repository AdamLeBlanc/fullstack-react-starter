function user(parent, args, context) {
  return context.db.query.user({ where: { id: args.id } });
}

function viewer(parent, args, { user }) {
  if (user) return user;
  return null;
}

module.exports = {
  user,
  viewer,
};
