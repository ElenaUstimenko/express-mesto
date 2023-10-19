const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;
const AuthorizationError = require('../errors/AuthorizationError');

function auth(req, res, next) {
  let payload;
  try {
    const { authorization } = req.headers;

    if ((authorization && authorization.startsWith('Bearer '))) {
      const token = authorization.replace('Bearer ', '');
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
      req.user = payload;
      next();
    } else {
      next(new AuthorizationError('Необходима авторизация'));
    }
  } catch (error) {
    next(new AuthorizationError('С токеном что-то не так'));
  }
}

/* function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization && authorization.startsWith('Bearer ')) {
    return next(new AuthorizationError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    return next(new AuthorizationError('С токеном что-то не так'));
  }
  req.user = payload; // записываем  payload в объект запроса
  return next(); // пропускаем запрос дальше
} */

module.exports = { auth };
