import CustomError from './customError.js';

class ForbiddenError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

export default ForbiddenError;
