const Card = require('../models/card');

const {
  NotFoundError,
  ValidationError,
  // ForbiddenError,
} = require('../errors/errors');

// GET /cards — возвращает все карточки
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    if (!cards) {
      // return res.status(NOT_FOUND).send({ message: 'Карточки не найдены' });
      throw new NotFoundError('Карточки не найдены');
    }
    return res.send(cards);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      // return res.status(INCORRECT).send({ message: 'Переданы некорректные данные' });
      return next(new ValidationError('Переданы некорректные данные'));
    }
    // return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    // return next(new ServerError('На сервере произошла ошибка'));
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
      // return res.status(INCORRECT).send({ message: 'Переданы
      // некорректные данные при создании карточки' });
      return next(ValidationError('Переданы некорректные данные'));
    }
    // return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    // return next(ServerError('На сервере произошла ошибка'));
    return next(error);
  }
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndRemove(cardId);

    if (!card) {
      // return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    /* const ownerId = card.owner._id;
    const userId = req.user._id;
    console.log('ownerId', ownerId);
    console.log('userId', userId);
    if (ownerId.valueOf() !== userId) {
      return res.status(INCORRECT).send({ message: 'Невозможно удалить карточку,
      созданную другим пользователем' });
      ForbiddenError('Невозможно удалить карточку, созданную другим пользователем')
    } */
    // if (ownerId === userId) {
    // return res.send(card);
    // }
    return res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      // return res.status(INCORRECT).send({ message: 'Переданы некорректные данные' });
      return next(new ValidationError('Переданы некорректные данные'));
    }
    // return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    // return next(new ServerError('На сервере произошла ошибка'));
    return next(error);
  }
};

/* function deleteCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user._id;
  console.log(cardId);
  console.log(userId);

  Card.findById({ _id: cardId })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      const ownerId = card.owner.id.valueOf();
      console.log(ownerId);
      if (ownerId.valueOf() !== userId) {
        res.status(404).send({ message: 'Невозможно удалить карточку,
        созданную другим пользователем' });
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
      // return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      throw new NotFoundError('Передан несуществующий _id карточки');
    }
    return res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      // return res.status(INCORRECT).send({ message: 'Переданы некорректные данные' });
      return next(new ValidationError('Переданы некорректные данные'));
    }
    // return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    // return next(new ServerError('На сервере произошла ошибка'));
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
