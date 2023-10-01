const User = require('../models/user');
const { INCORRECT } = require('../utils/constants');
const { NOT_FOUND } = require('../utils/constants');
const { SERVER_ERROR } = require('../utils/constants');

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

// POST /users — создаёт пользователя
const postUsers = async (req, res) => {
  try {
    const newUser = await new User(req.body);
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
  getUsers,
  getUserId,
  postUsers,
  updateUser,
  updateUserAvatar,
};
