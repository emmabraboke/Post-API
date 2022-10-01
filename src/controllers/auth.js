import User from '../database/models/User.js';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/index.js';
import sendEmail from '../utils/sendEmail.js';
import validation from '../validations/userValidation.js';
import jwt from 'jsonwebtoken';
import config from '../../config/default.js';
import crypto from 'crypto';

export const signUp = async (req, res) => {
  const { error } = validation(req.body);

  if (error) {
    throw new BadRequestError(error);
  }

  const verificationToken = crypto.randomBytes(48).toString('hex');
  const user = await User.create({ ...req.body, verificationToken });
  const emailFields = {
    to: user.email,
    subject: 'Verify your account',
    html: `<a href=${config.origin}?email=${user.email}&token=${verificationToken}>Click link to Verify</a>`,
  };

  await sendEmail({ ...emailFields });

  res.status(200).json(user);
};

export const verifyUser = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorizedError('invalid credentials');
  }

  if (user.verificationToken !== verificationToken) {
    throw new UnauthorizedError('invalid credentials');
  }

  user.isVerified = true;
  user.verificationToken = '';
  await user.save();

  res.status(200).json('verified');
};

export const signIn = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError('provide login credentials');
  }

  let user = null;
  const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
    username
  );

  if (!isEmail) {
    user = await User.findOne({ username });
  } else {
    user = await User.findOne({ email: username });
  }

  if (!user) {
    throw new UnauthorizedError('invalid credentials');
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new UnauthorizedError('invalid credentials');
  }

  const tokenUser = {
    id: user._id,
    role: user.role,
  };
  const token = jwt.sign(tokenUser, config.tokenSecret, {
    expiresIn: config.refreshTokenLife,
  });
  res.cookie('refreshToken', token, { maxAge: config.refreshTokenLife });
  res.status(200).json(user);
};

export const googleSign = async (req, res) => {
  res.json('google');
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError(`No user with email ${email}`);
  }

  const token = crypto.randomBytes(48).toString('hex');

  //Token life
  const passwordTokenLife = Date.now() + 30 * 60000;

  const tokenFields = {
    forgotPasswordToken: token,
    passwordTokenLife,
    user: user._id,
  };

  await Token.create({ ...tokenFields });

  const emailFields = {
    to: email,
    subject: 'Verify your account',
    html: `<a href=${config.origin}?email=${email}&token=${token}>Click link to Reset Password</a>`,
  };

  await sendEmail({ ...emailFields });

  res.json(user);
};

export const resetPassword = async (req, res) => {
  const { email, forgotPasswordToken, password } = req.body;

  if (!email || !forgotPasswordToken || !password) {
    throw new BadRequestError(
      'provide email, forgotPasswordToken and password'
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorizedError('invalid credentials');
  }

  const tokenUser = await Token.findOne({ user: user.id, forgotPasswordToken });
  if (!tokenUser) {
    throw new UnauthorizedError('invalid credentials');
  }

  // checks if token life time has elasped
  if (tokenUser.passwordTokenLife.getTime() < Date.now()) {
    throw new UnauthorizedError('invalid credentials');
  }

  user.password = password;
  tokenUser.passwordTokenLife = Date.now();
  await user.save();
  await user.save();
  res.status(200).json('password changed');
};

export const changePassword = async (req, res) => {
  const {
    user: { id: userId },
    body: { oldPassword, newPassword },
  } = req;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError('provide old and new password');
  }

  const user = await User.findOne({ _id: userId });
  const isMatch = user.comparePassword(oldPassword);

  if (!isMatch) {
    throw new UnauthorizedError('incorrect password');
  }

  user.password = newPassword;
  await user.save();
  res.status(200).json('password changed');
};

export const logOut = async (req, res) => {
  res.clearCookie('refreshToken');
  req.session.destroy(function (err) {
    throw new UnauthorizedError(err);
  });
  res.json('logout successful');
};
