import CustomError from './customError.js';

class UnauthorizedError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

export default UnauthorizedError;
