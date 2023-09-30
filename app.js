const express = require('express');
const json = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const limiter = require('./middlewares/rateLimiter');
// env хранит все переменные окружения
const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb',
} = process.env;

// создаём приложение
const app = express();

app.use(helmet());
app.use(limiter);

// подключаемся к серверу MongoDB
mongoose.connect(MONGO_URL);

// после инициализации приложения, но до задействования роутов
app.use(json());
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '651431b4f4b058a8bbbea2d6',
  };
  next();
});
module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
  console.log(res);
};

// подключение
app.use(router);

// запускаем сервер, слушаем порт 3000
app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
