import {
  createChat,
  getChats,
  deleteChat,
  getChat,
} from '../controllers/chat.js';
import { Router } from 'express';

const route = Router();

route.post('/createChat', createChat);
route.get('/', getChats);
route.get('/:id', getChat);
route.delete('/:id', deleteChat);

export default route;
