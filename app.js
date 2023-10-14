const express = require('express');
const json = require('express');
require('dotenv').config();
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const limiter = require('./middlewares/rateLimiter');

// env хранит все переменные окружения
// const { PORT, MONGO_URL } = process.env;
const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb',
} = process.env;

// создаём приложение
const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(limiter);

// подключаемся к серверу MongoDB
mongoose.connect(MONGO_URL);

// после инициализации приложения, но до задействования роутов
app.use(json());
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// подключение
app.use(router);

app.use(errors()); // обработчик ошибок celebrate

app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

// запускаем сервер, слушаем порт 3000
app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
