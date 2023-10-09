const jwt = require('jsonwebtoken');
const { SERVER_ERROR } = require('../utils/constants');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ message: 'С токеном что-то не так' });
    }
    if (error.name === 'NotAutantificate') {
      return res.status(401).send({ message: 'Необходима авторизация' });
    }
    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
