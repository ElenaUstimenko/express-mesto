const userRoutes = require('express').Router();
const {
  login,
  getUsers,
  getUserMe,
  getUserId,
  createUsers,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

userRoutes.post('/signin', login);
userRoutes.post('/signup', createUsers);

// userRoutes.use(auth); - version 2
userRoutes.get('/', auth, getUsers);
userRoutes.get('/me', auth, getUserMe);
userRoutes.get('/:userId', auth, getUserId);
userRoutes.patch('/me', auth, updateUser);
userRoutes.patch('/me/avatar', auth, updateUserAvatar);

module.exports = userRoutes;
