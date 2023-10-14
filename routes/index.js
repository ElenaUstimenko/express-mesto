const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { NotFoundError } = require('../errors/errors');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.all('*', (req, res) => {
  res.status(NotFoundError).send({ message: 'Неверный адрес запроса' });
});

module.exports = router;
