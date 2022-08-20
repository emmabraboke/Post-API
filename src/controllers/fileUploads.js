import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

export const fileUpload = async (req, res) => {
  const file = req.file;
  const response = await cloudinary.uploader.upload(file.path, {
    folder: 'twitter',
  });
  res.status(200).json({ image: response.url });
};

export const fileUploads = async (req, res) => {
  const files = req.files;

  let url = [];
  for (let i = 0; i < files.length; i++) {
    let response = await cloudinary.uploader.upload(files[i].path, {
      folder: 'twitter',
    });
    url.push({ image: response.url });
  }

  fs.rmdir('uploads', { recursive: true });
  res.status(200).json(url);
};
