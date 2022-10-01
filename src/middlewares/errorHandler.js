const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message;

  if (err.name === 'CastError') {
    message = `no item with id ${err.value}`;
    statusCode = 404;
  }

  if (err.code === 11000) {
    message = 'provide another email';
    statusCode = 400;
  }

  res.status(statusCode).json(message);
};

export default errorHandler;
