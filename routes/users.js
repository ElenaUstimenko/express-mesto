const userRoutes = require('express').Router();
const { getUsers, getUserId, postUsers, updateUser, updateUserAvatar } = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/:userId', getUserId);
userRoutes.post('/', postUsers);
userRoutes.patch('/me', updateUser);
userRoutes.patch('/me/avatar', updateUserAvatar);

module.exports = userRoutes;
