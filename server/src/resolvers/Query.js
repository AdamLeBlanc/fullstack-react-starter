function user(parent, args, context, info) {
  return context.db.query.user({ where: { id: args.id } });
}

async function viewer(parent, args, { db, user }, info) {
  if (user) return user;
}

module.exports = {
  user,
  viewer,
};
