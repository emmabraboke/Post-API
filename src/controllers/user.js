import Post from '../database/models/Post.js';
import User from '../database/models/User.js';
import { NotFoundError } from '../errors/index.js';
import checkPermission from '../utils/checkPermission.js';

export const getUsers = async (req, res) => {
  const { username, name } = req.query;

  const query = {};

  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }

  if (username) {
    query.username = { $regex: username, $options: 'i' };
  }

  const users = await User.find(query).sort('name').select('-password');
  res.status(200).json(users);
};

export const getUser = async (req, res) => {
  const userId = req.params.id;

  const user = await User.findOne({ _id: userId }).select('-password');

  if (!user) {
    throw new NotFoundError(`no item with id ${userId} `);
  }

  checkPermission(req, req.user.id, user._id);
  res.status(200).json(user);
};

export const updateUser = async (req, res) => {
  const {
    params: { id: userId },
    body,
  } = req;
  const user = await User.findOneAndUpdate({ _id: userId }, body, {
    runValidators: true,
    new: true,
  });

  if (!user) {
    throw new NotFoundError(`no item with id ${userId} `);
  }

  res.status(200).json(user);
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new NotFoundError(`no item with id ${userId} `);
  }

  await user.remove();
  res.status(200).json();
};

// Follow and Unfollow
export const follow = async (req, res) => {
  const follower = await User.findOne({ _id: req.params.id }).select('_id');
  const user = await User.findOne({ _id: req.user.id }).select('_id');

  await User.findOneAndUpdate(
    { _id: user._id },
    { $push: { followings: follower } }
  );
  await User.findOneAndUpdate(
    { _id: follower._id },
    { $push: { followers: user } }
  );

  res.status(200).json('user followed');
};

export const unfollow = async (req, res) => {
  const follower = await User.findOne({ _id: req.params.id }).select('_id');
  const user = await User.findOne({ _id: req.user.id }).select('_id');

  await User.findOneAndUpdate(
    { _id: user._id },
    { $pull: { followings: follower } }
  );
  await User.findOneAndUpdate(
    { _id: follower._id },
    { $pull: { followers: user } }
  );

  res.status(200).json('user unfollowed');
};

// Bookmark
export const saveBookmark = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  await User.findOneAndUpdate(
    { id: req.user.id },
    { $push: { bookmark: post } }
  );

  res.status(200).json('post saved to bookmark');
};

export const deleteBookmark = async (req, res) => {
  const post = await Post.findOne({ postId: req.params.id });
  await User.findOneAndUpdate(
    { id: req.user.id },
    { $pull: { bookmark: post } }
  );
  res.status(200).json('post removed bookmark');
};
