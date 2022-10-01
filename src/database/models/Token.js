import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema(
  {
    forgotPasswordToken: {
      type: String,
      default: '',
    },
    passwordTokenLife: {
      type: Date,
    },
    user: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Token', TokenSchema);
