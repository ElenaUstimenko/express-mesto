const Card = require('../models/card');

const {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} = require('../errors/errors');

// GET /cards — возвращает все карточки
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    if (!cards) {
      throw new NotFoundError('Карточки не найдены');
    }
    return res.send(cards);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(error);
  }
};

// POST /cards — создаёт карточку
const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const newCard = await Card.create({ name, link, owner: ownerId });
    return res.status(201).send(await newCard.save());
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(ValidationError('Переданы некорректные данные'));
    }
    return next(error);
  }
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
// пишет ошибку 500 и удаляет карточку, а надо, чтобы была ошибка 403 и карточка не удалялась
const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    const ownerId = card.owner._id;
    const userId = req.user._id;
    console.log('ownerId', ownerId);
    console.log('userId', userId);
    console.log(ownerId.valueOf() === userId);

    if (ownerId.valueOf() !== userId) {
      throw next(ForbiddenError('Невозможно удалить карточку, созданную другим пользователем'));
    }
    // if (ownerId.valueOf() === userId) {
    // return res.send(card);
    await card.remove();
    // }
    return res.send(card);
  } catch (error) {
    // if (error.name === 'ValidationError' || error.name === 'CastError') {
    // return next(new ValidationError('Переданы некорректные данные'));
    // }
    return next(error);
  }
};

/* function deleteCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user._id;

  Card.findById({ _id: cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      const ownerId = card.owner.id.valueOf();
      if (ownerId.valueOf() !== userId) {
        return next(ForbiddenError('Невозможно удалить карточку, созданную другим пользователем'));
      }
      card
        .remove()
        .then(() => res.send({ data: card }))
        .catch(next);
    })
    .catch(next);
} */

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
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(error);
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
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(error);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
