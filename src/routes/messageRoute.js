import {
  getMessages,
  deleteMessage,
  createMessage,
} from '../controllers/message.js';
import { Router } from 'express';

const route = Router();

route.post('/createMessage', createMessage);
route.get('/:id', getMessages);
route.delete('/deleteMessage/:id', deleteMessage);

export default route;
