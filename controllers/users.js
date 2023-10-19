const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;

const ReRegistrationError = require('../errors/ReRegistrationError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const AuthorizationError = require('../errors/AuthorizationError');

// получает из запроса почту и пароль и проверяет их - signin
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      return res.send({ jwt: token });
    })
    .catch((err) => {
      if (err.name === 'AuthorizationError') {
        return next(new AuthorizationError('Неправильные почта или пароль'));
      }
      return next(err);
    });
};

const SOLT_ROUNDS = 10;

// POST  — создаёт пользователя - signup
const createUsers = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
      about,
      avatar,
    } = req.body;
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);

    const newUser = await new User({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    return res.status(201).send(await newUser.save());
  } catch (err) {
    if (err.code === 11000) {
      return next(new ReRegistrationError('Данный email уже зарегистрирован'));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

// GET /users — возвращает всех пользователей
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

// GET /users/me - возвращает информацию о текущем пользователе
const getUserMe = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.user._id });

    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

// GET /users/:userId - возвращает пользователя по _id
const getUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

// PATCH /users/me — обновляет профиль
const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    }
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

// PATCH /users/me/avatar — обновляет аватар
const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    }
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

module.exports = {
  login,
  getUsers,
  getUserMe,
  getUserId,
  createUsers,
  updateUser,
  updateUserAvatar,
};
