const express = require('express');
const router = require('express').Router();
// const NotFoundError = require('../errors/NotFoundError');
const routerSignup = require('./signup');
const routerSignin = require('./signin');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.all('*', express.json());

router.use('/signup', routerSignup);
router.use('/signin', routerSignin);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

/* router.all('*', (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
}); */

module.exports = { router };
