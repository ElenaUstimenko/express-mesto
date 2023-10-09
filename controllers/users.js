const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { INCORRECT } = require('../utils/constants');
const { NOT_FOUND } = require('../utils/constants');
const { SERVER_ERROR } = require('../utils/constants');

// получает из запроса почту и пароль и проверяет их
const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
    // аутентификация успешна! пользователь в переменной user
    // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        // вернём токен
        .send({ jwt: token });
    })
    .catch((err) => {
      // возвращаем ошибку аутентификации
      res.status(401).send({ message: err.message });
    });
};

// GET /users — возвращает всех пользователей
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(NOT_FOUND).send({ message: 'Пользователи не найдены' });
    }
    return res.send(users);// передать данные пользователей
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(INCORRECT).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

// GET /users/me - возвращает информацию о текущем пользователе
const getUserMe = async (req, res) => {
  try {
    const { userId } = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(INCORRECT).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

// GET /users/:userId - возвращает пользователя по _id
const getUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(INCORRECT).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

const SOLT_ROUNDS = 10;

// POST /users — создаёт пользователя
const createUsers = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);

    const newUser = await new User({ email, password: hash });
    return res.status(201).send(await newUser.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(INCORRECT).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

// PATCH /users/me — обновляет профиль
const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    // console.log({ name, about });
    // console.log(req.user._id);
    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(INCORRECT).send({ message: 'Переданы некорректные данные при при обновлении профиля' });
    }
    if (error.name === 'CastError') {
      return res.status(INCORRECT).send({ message: 'Передан некорректный _id' });
    }
    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

// PATCH /users/me/avatar — обновляет аватар
const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    // console.log(avatar);
    // console.log(req.user._id);
    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(INCORRECT).send({ message: 'Переданы некорректные данные при при обновлении профиля' });
    }
    if (error.name === 'CastError') {
      return res.status(INCORRECT).send({ message: 'Передан некорректный _id' });
    }
    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
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
