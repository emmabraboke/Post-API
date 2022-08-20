const notFound = (req, res, next) => {
  res.status(404).send('route not found');
};

export default notFound;
