import { Router } from 'express';
import {
  getAllPosts,
  getPost,
  getUserPosts,
  createPost,
  deletePost,
  updatePost,
  getPostReply,
  getUserReply,
  savePost,
  getDrafts,
} from '../controllers/posts.js';

const route = Router();

route.post('/createPost', createPost);
route.post('/savePost', savePost);
route.get('/all', getAllPosts);
route.get('/user', getUserPosts);
route.get('/draft', getDrafts);
route.get('/reply', getUserReply);
route.get('/reply/:id', getPostReply);
route.patch('/:id', updatePost);
route.delete('/:id', deletePost);
route.get('/:id', getPost);

export default route;
