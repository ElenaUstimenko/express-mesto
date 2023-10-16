// const express = require('express');
const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { routerSignin } = require('./signin');
const { routerSignup } = require('./signup');
// router.all('*', express.json());

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/signin', routerSignin);
router.use('/signup', routerSignup);

router.all('*', (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
});

module.exports = { router };
