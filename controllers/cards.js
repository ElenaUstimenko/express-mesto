const mongoose = require('mongoose');
const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

// GET /cards — возвращает все карточки
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});

    if (!cards) {
      throw new NotFoundError('Карточки не найдены');
    }
    return res.send(cards);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

// POST /cards — создаёт карточку
const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const newCard = await Card.create({ name, link, owner: ownerId });
    return res.status(201).send(await newCard.save());
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(ValidationError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  return Card.findById(cardId)
    .orFail()
    .then((card) => {
      const ownerId = card.owner.toString();
      console.log('cardId', cardId);
      console.log('ownerId', ownerId);
      console.log('userId', userId);
      console.log(ownerId.valueOf() === userId);
      if (ownerId !== userId) {
        throw new ForbiddenError('Невозможно удалить карточку, созданную другим пользователем');
      }
      return card.deleteOne();
    })
    .then((cardData) => res.status(200).send(cardData))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Передан несуществующий _id: ${cardId}`));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

// PUT /cards/:cardId/likes — поставить лайк карточке
function likeCard(req, res, next) {
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      }
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
}

// DELETE /cards/:cardId/likes — убрать лайк с карточки
const dislikeCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
