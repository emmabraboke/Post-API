import { Router } from 'express';
import passport from 'passport';

import {
  signIn,
  signUp,
  googleSign,
  verifyUser,
  forgotPassword,
  resetPassword,
  logOut,
  changePassword,
} from '../controllers/auth.js';

import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  follow,
  unfollow,
  saveBookmark,
  deleteBookmark,
} from '../controllers/user.js';

import {
  authentication,
  authorization,
} from '../middlewares/authentication.js';

const route = Router();

route.post('/signUp', signUp);
route.post(
  '/signIn',
  passport.authenticate('local', { failureRedirect: '/' }),
  signIn
);
route.post('/verify', verifyUser);
route.post('/forgotPassword', forgotPassword);
route.post('/reset', resetPassword);
route.post('/password', changePassword);
route.get('/logOut', logOut);

route.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

route.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleSign
);

route.get('/', getUsers);
route.patch('/follow/:id', authentication, follow);
route.patch('/unfollow/:id', authentication, unfollow);
route.patch('/savebookmark/:id', authentication, saveBookmark);
route.patch('/deleteBookmark/:id', authentication, deleteBookmark);
route.get('/:id', getUser);
route.patch('/:id', authentication, updateUser);
route.delete('/:id', authentication, deleteUser);

export default route;
