const session = require('express-session');

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
});
