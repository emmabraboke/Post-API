import { Router } from 'express';
import postRoute from './postRoute.js';
import userRoute from './userRoute.js';
import chatRoute from './chatRoute.js';
import messageRoute from './messageRoute.js';
import fileUploadRoute from './fileUploadRoute.js';

const route = Router();

route.use('/user', userRoute);
route.use('/post', postRoute);
route.use('/chat', chatRoute);
route.use('/message', messageRoute);
route.use('/', fileUploadRoute);

export default route;
