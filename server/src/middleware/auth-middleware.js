module.exports = (db, server) => async (req, res, next) => {
  if (!req.session.userId) return next();
  const user = await db.query.user({
    where: { id: req.session.userId },
  });

  if (!!user) {
    const old = server.context({ request: req });
    server.context = ({ request, connection }) => ({
      ...old,
      user,
    });
  }
  next();
};
