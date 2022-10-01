import mongoose from 'mongoose';

const ChatSchema = mongoose.Schema(
  {
    usersId: {
      type: Array,
      required: true,
    },

    deleteChat: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Chat', ChatSchema);
