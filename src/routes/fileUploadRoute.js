import multer from 'multer';
import { Router } from 'express';
import { fileUpload, fileUploads } from '../controllers/fileUploads.js';

const route = Router();

const upload = multer({ dest: 'uploads/' });

route.post('/upload', upload.single('image'), fileUpload);
route.post('/uploads', upload.array('image'), fileUploads);

export default route;
