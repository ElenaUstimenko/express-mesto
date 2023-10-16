const routerSignup = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUsers } = require('../controllers/users');

routerSignup.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  }),
}), createUsers);

module.exports = routerSignup;
