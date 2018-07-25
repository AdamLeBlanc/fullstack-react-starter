const session = require('express-session');
const RedisStore = require('connect-redis')(session);
module.exports = session({
  secret: 'shhhhhhh',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 7,
    sameSite: true,
  },
  store: new RedisStore({
    host: 'localhost',
    port: 6379,
  }),
});
