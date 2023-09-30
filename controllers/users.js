const User = require('../models/user');

// GET /users — возвращает всех пользователей
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).send({ message: 'Пользователи не найдены' });
    }
    return res.send(users);// передать данные пользователей
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

// GET /users/:userId - возвращает пользователя по _id
const getUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

// POST /users — создаёт пользователя
const postUsers = async (req, res) => {
  try {
    const newUser = await new User(req.body);
    return res.status(201).send(await newUser.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
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
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при при обновлении профиля' });
    }
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан некорректный _id' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
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
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при при обновлении профиля' });
    }
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан некорректный _id' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports = {
  getUsers,
  getUserId,
  postUsers,
  updateUser,
  updateUserAvatar,
};
