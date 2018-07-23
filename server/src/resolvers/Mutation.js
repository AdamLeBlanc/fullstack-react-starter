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

module.exports = {
  signup,
  signin,
};
