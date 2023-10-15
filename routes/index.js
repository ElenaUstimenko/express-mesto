const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
// const { NotFoundError } = require('../errors/errors');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.all('*', (err, req, res, next) => {
  const { statusCode = 404, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 404
        ? 'Неверный адрес запроса'
        : message,
    });
  next();
  // res.status(NotFoundError).send({ message: 'Неверный адрес запроса' });
  // next(NotFoundError).send({ message: 'Неверный адрес запроса' });
});

module.exports = router;
