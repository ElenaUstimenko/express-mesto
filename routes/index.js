const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const routerSignup = require('./signup');
const routerSignin = require('./signin');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/', routerSignup);
router.use('/', routerSignin);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.all('*', (req, res, next) => {
  throw next(new NotFoundError('Неверный адрес запроса'));
});

module.exports = { router };
