import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    location: {
      type: String,
    },
    bio: {
      type: String,
    },
    role: {
      type: String,
      default: 'user',
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    headerImage: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: '',
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },

    bookmark: {
      type: Array,
      default: [],
    },

    googleId: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

export default mongoose.model('User', UserSchema);
