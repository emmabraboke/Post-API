import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
    },
    message: {
      type: String,
    },
    like: {
      type: Number,
      default: 0,
    },
    retweet: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
    },
    media: {
      type: String,
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
  },
  { timeStamps: true }
);

export default mongoose.model('Post', PostSchema);
