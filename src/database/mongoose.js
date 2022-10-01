import mongoose from 'mongoose';
import config from '../../config/default.js';

const connection = (uri) => {
  mongoose.connect(uri);
};

export default connection;
