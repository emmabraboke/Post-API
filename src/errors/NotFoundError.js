import CustomError from './customError.js';

class NotFoundError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

export default NotFoundError;
