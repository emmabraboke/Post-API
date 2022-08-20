const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message;

  res.status(statusCode).json(message);
};

export default errorHandler;
