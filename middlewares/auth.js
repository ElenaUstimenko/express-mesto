const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;
const AuthorizationError = require('../errors/AuthorizationError');

// first version:
/* module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies.jwt;
    if (!token) {
      // return res.status(401).send({ message: 'Необходима авторизация' });
      throw new AuthorizationError('Необходима авторизация');
    }
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'some-secret-key');
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      // return res.status(401).send({ message: 'С токеном что-то не так' });
      next(new AuthorizationError('С токеном что-то не так'));
    }
    if (error.name === 'NotAutantificate') {
      // return res.status(401).send({ message: 'Необходима авторизация' });
      next(new AuthorizationError('Необходима авторизация'));
    }
    // return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    // next(new ServerError('На сервере произошла ошибка'));
    return next(error);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
}; */

// second version:
/* function auth(req, res, next) {
  const { authorization } = req.headers;
  const { cookies } = req.cookies.jwt;

  if (!(authorization && authorization.startsWith('Bearer ')) && !(cookies && cookies.jwt)) {
    return next(new AuthorizationError('Необходима авторизация'));
  }

  const token = authorization ? authorization.replace('Bearer ', '') : cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    return next(new AuthorizationError('С токеном что-то не так'));
  }
  req.user = payload; // записываем  payload в объект запроса
  return next(); // пропускаем запрос дальше
} */

// third version:
function auth(req, res, next) {
  const { cookies } = req.cookies.jwt;

  if (!cookies || !cookies.jwt) {
    return next(new AuthorizationError('Необходима авторизация'));
  }

  const token = cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    return next(new AuthorizationError('С токеном что-то не так'));
  }

  req.user = payload;
  return next();
}

module.exports = { auth };
