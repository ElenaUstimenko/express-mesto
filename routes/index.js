const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { NOT_FOUND } = require('../utils/constants');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.all('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Неверный адрес запроса' });
});

module.exports = router;
