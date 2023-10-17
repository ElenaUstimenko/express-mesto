const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');
const { URL_REGEX } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => URL_REGEX.test(url),
      message: 'Некорректные данные, введите URL',
    },
  },
  email: {
    type: String,
    required: true, // обязательное поле
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Некорректный email или пароль',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,

    validate: {
      validator: ({ length }) => length >= 6,
      message: 'Пароль должен состоять минимум из 6 символов',
    },
  },
}, { toObject: { useProjection: true }, toJSON: { useProjection: true } });
// чтобы пароль не возвращался ^

userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }) // this — это модель User
    .select('+password')
    .then((user) => {
    // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('User', userSchema);
