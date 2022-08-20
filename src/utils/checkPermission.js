import { UnauthorizedError } from '../errors/index.js';

const checkPermission = (req, userId, responseId) => {
  if (req.user.role === 'admin' || userId === responseId.toString()) return;

  throw new UnauthorizedError('no permission to access this route');
};

export default checkPermission;
