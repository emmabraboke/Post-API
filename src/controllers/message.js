import Message from '../database/models/Message.js';
import { NotFoundError } from '../errors/index.js';

export const getMessages = async (req, res) => {
  const messages = await Message.find({
    chatId: req.params.id,
    deleteMessage: req.user.id,
  });
  res.status(200).json(messages);
};

export const createMessage = async (req, res) => {
  const message = await Message.create(req.body);
  res.status(201).json(message);
};

export const deleteMessage = async (req, res) => {
  const message = await Message.findOne({ _id: req.params.id });

  if (!message) {
    throw new NotFoundError(`no item with id ${req.params.id}`);
  }

  //if both users have not delete the messages
  // req.params.id is the _id of the message while req.user.id is the userId
  if (message.deleteMessage.length > 1) {
    message.deleteMessage = message.deleteMessage.filter(
      (item) => item !== req.user.id
    );
    await message.save();
    return res.status(200).json('message deleted');
  }

  // Takes the userId === req.user.id and responseId === usersId
  // checkPermission(req, userId, responseId)
  checkPermission(req, req.user.id, message.deleteMessage[0]);
  await message.remove();
  res.status(200).json('message deleted');
};
