const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;

const {
  ReRegistrationError,
  NotFoundError,
  ValidationError,
} = require('../errors/errors');

// получает из запроса почту и пароль и проверяет их - signin
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ jwt: token });
    })
    .catch(next);
};

const SOLT_ROUNDS = 10;

// POST /users — создаёт пользователя - signup
const createUsers = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);

    const newUser = await new User({ email, password: hash });
    return res.status(201).send(await newUser.save());
  } catch (error) {
    if (error.code === 11000) {
      return next(new ReRegistrationError('Данный email уже зарегистрирован'));
    }
    return next(error);
  }
};

// GET /users — возвращает всех пользователей
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    if (!users) {
      throw new NotFoundError('Пользователи не найдены');
    }
    return res.send(users);// передать данные пользователей
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(error);
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
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(error);
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
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(error);
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
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(error);
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
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(error);
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
