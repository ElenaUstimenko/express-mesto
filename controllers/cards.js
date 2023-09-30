const Card = require('../models/card');

// GET /cards — возвращает все карточки
const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return res.status(500).send({ message: 'Ошибка на стороне сервера', error });
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
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки', ...error });
    }
  }
  Card.push(req.body);
  return res.send(req.body);
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    // console.log(cardId)
    const card = await Card.findByIdAndRemove(cardId);

    if (!card) {
      return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    }
    const ownerId = card.owner.toString();
    const userId = req.user._id;
    // console.log('ownerId', ownerId);
    // console.log('userId', userId);
    if (ownerId !== userId) {
      return res.status(404).send({ message: 'Невозможно удалить карточку, созданную другим пользователем' });
    }
    if (ownerId === userId) {
      return res.send(card);
    }
    return res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные', error });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
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
      return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
    }
    return res.send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
    }
  }
  return res.status(500).send({ message: 'Ошибка на стороне сервера' });
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
      return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
    }
    return res.send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).send({ message: 'Переданы некорректные данные для снятия лайка' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные', error });
    }
  }
  return res.status(500).send({ message: 'Ошибка на стороне сервера' });
};

module.exports = {
  getCards,
  postCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
