import { v2 as cloudinary } from 'cloudinary';
import config from '../../config/default.js';

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudKey,
  api_secret: config.cloudSecret,
  secure: true,
});

export default cloudinary;
