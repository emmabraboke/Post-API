import jwt from 'jsonwebtoken';
import config from '../../config/default.js';
import { UnauthorizedError } from '../errors/index.js';

export const authentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError('invalid credentials');
    }

    const user = jwt.verify(refreshToken, config.tokenSecret);

    req.user = {
      id: user.id,
      role: user.role,
    };
    req.session.passport = {};
    req.session.passport.user = user.id;
    next();
  } catch (error) {
    throw new UnauthorizedError(error);
  }
};

export const authorization = (role) => {
  return (req, res, next) => {
    if (role.includes(req.user.role)) {
      return next();
    }
    throw new UnauthorizedError('no authorization to access this route');
  };
};
