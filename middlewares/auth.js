const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../errors/errors');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies.jwt;
    // without cookies:
    // const { token } = req.headers.authorization;
    // if (!token || !token.startsWith('Bearer ')) {
    //  return res.status(401).send({ message: 'Необходима авторизация' });
    // }
    // const validToken = token.replace('Bearer ', '');
    // payload = jwt.verify(validToken, NODE_ENV ? JWT_SECRET : 'some-secret-key');
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
};
