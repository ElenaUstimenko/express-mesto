const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { auth } = require('../middlewares/auth');
const { URL_REGEX } = require('../utils/constants');
const {
  getUsers,
  getUserMe,
  getUserId,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

userRoutes.get('/', auth, getUsers);
userRoutes.get('/me', auth, getUserMe);

userRoutes.get('/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserId);

userRoutes.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

userRoutes.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(URL_REGEX),
  }),
}), updateUserAvatar);

module.exports = userRoutes;
