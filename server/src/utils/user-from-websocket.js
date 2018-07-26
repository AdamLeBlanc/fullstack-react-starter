const nodeCookie = require('node-cookie');
const redisClient = require('./RedisClient')();

module.exports = db => async (connectionParams, webSocket) => {
  const cookie = nodeCookie.parse(webSocket.upgradeReq, 'shhhhhhh');
  const session = JSON.parse(
    await redisClient.getAsync(`sess:${cookie['connect.sid']}`)
  );
  const user = session
    ? db.query.user({ where: { id: session.userId } })
    : null;

  if (!user) throw new Error('Authentication Requried');
  return {
    user,
  };
};
