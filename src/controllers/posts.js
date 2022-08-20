import Post from '../database/models/Post.js';
import NotFoundError from '../errors/NotFoundError.js';

export const getAllPosts = async (req, res) => {
  const posts = await Post.find({ isDraft: false });
  res.status(200).json(posts);
};

export const getUserPosts = async (req, res) => {
  const posts = await Post.find({ user: req.user.id, isDraft: false });
  res.status(200).json(posts);
};

export const createPost = async (req, res) => {
  const postFields = req.body;

  // check if post is a draft
  if (postFields._id) {
    let post = await Post.findOne({ _id: postFields._id });
    if (!post) {
      throw new NotFoundError(`no post with id ${postFields.id}`);
    }

    post = await Post.findOneAndUpdate(
      { _id: postFields._id },
      { ...postFields, isDraft: false },
      { runValidators: true, new: true }
    );

    return res.status(200).json(post);
  }

  const post = await Post.create({ ...req.body, user: req.user.id });
  res.status(200).json(post);
};

export const getPost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });

  if (!post) {
    throw new NotFoundError(`no item with id ${req.params.id} `);
  }

  res.status(200).json(post);
};

export const updatePost = async (req, res) => {
  const { message, like, retweet } = req.body;
  const post = await Post.findOne({ _id: req.params.id });

  if (!post) {
    throw new NotFoundError(`no item with id ${req.params.id} `);
  }

  if (like) post.like += like;
  if (retweet) post.retweet += retweet;
  if (message) post.message = message;

  await post.save();

  res.status(200).json(post);
};

export const deletePost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });

  if (!post) {
    throw new NotFoundError(`no item with id ${req.params.id} `);
  }

  await post.remove();
  res.status(200).json();
};

export const getPostReply = async (req, res) => {
  const postId = req.params.id;
  const reply = await Post.find({ postId });
  res.status(200).json(reply);
};

export const getUserReply = async (req, res) => {
  const reply = await Post.find({ user: req.user.id }).exists('postId');
  res.status(200).json(reply);
};

export const savePost = async (req, res) => {
  const post = await Post.create({ ...req.body, user: req.user.id });
  post.isDraft = true;
  await post.save();
  res.status(201).json('post saved to draft');
};

export const getDrafts = async (req, res) => {
  const post = await Post.find({ user: req.user.id, isDraft: true });

  res.status(200).json(post);
};
