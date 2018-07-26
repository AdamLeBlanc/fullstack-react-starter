const { promisifyAll } = require('bluebird');
const redis = promisifyAll(require('redis'));

let redisClient;

function getRedisClient() {
  if (redisClient) return redisClient;

  return (redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
  }));
}

module.exports = getRedisClient;
