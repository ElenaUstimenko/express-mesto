// const express = require('express');
const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

// router.all('*', express.json());

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.all('*', (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
});

module.exports = { router };
