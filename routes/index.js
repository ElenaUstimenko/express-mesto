/* const router = require('express').Router();
// const { NotFoundError } = require('../errors/errors');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

/* router.all('*', (req, res) => {
  res.status(NotFoundError).send({ message: 'Неверный адрес запроса' });
}); */

// module.exports = router;
