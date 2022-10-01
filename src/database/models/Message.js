import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
    },
    message: {
      type: String,
    },
    media: {
      type: String,
    },

    chatId: {
      type: mongoose.Types.ObjectId,
    },
    deleteMessage: {
      type: Array,
      required: true,
    },
  },
  { timestamp: true }
);

export default mongoose.model('Message', MessageSchema);
