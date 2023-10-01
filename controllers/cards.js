const Card = require('../models/card');
const { INCORRECT } = require('../utils/constants');
const { NOT_FOUND } = require('../utils/constants');
const { SERVER_ERROR } = require('../utils/constants');

// GET /cards — возвращает все карточки
const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    if (!cards) {
      return res.status(NOT_FOUND).send({ message: 'Карточки не найдены' });
    }
    return res.send(cards);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(INCORRECT).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

// POST /cards — создаёт карточку
const postCards = async (req, res) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const newCard = await Card.create({ name, link, owner: ownerId });
    return res.status(201).send(await newCard.save());
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(INCORRECT).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    // console.log(cardId)
    const card = await Card.findByIdAndRemove(cardId);

    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    }
    // const ownerId = card.owner.toString();
    // const userId = req.user._id;
    // console.log('ownerId', ownerId);
    // console.log('userId', userId);
    // if (ownerId !== userId) {
    // return res.status(404).send({ message: 'Невозможно удалить карточку,
    // созданную другим пользователем' });
    // }
    // if (ownerId === userId) {
    // return res.send(card);
    // }
    return res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(INCORRECT).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

// PUT /cards/:cardId/likes — поставить лайк карточке
const likeCard = async (req, res) => {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
    }
    return res.send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(INCORRECT).send({ message: 'Переданы некорректные данные для постановки лайка' });
    }
    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
const dislikeCard = async (req, res) => {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
    }
    return res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(INCORRECT).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = {
  getCards,
  postCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
