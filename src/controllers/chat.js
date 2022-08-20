import Chat from '../database/models/Chat.js';
import NotFoundError from '../errors/NotFoundError.js';
import checkPermission from '../utils/checkPermission.js';

export const createChat = async (req, res) => {
  const { usersId } = req.body;
  let chat = await Chat.findOne({
    $or: [{ usersId: usersId[0] }, { usersId: usersId[1] }],
  });

  // check if the user has had conversation with the other user before
  if (chat) {
    //checks if user has deleted previous converstion
    if (!chat.deleteChat.includes(req.user.id)) {
      console.log('hello');
      chat.deleteChat.push(req.user.id);
      await chat.save();
    }
    //check if the other user is still in the conversation
    else {
      if (chat.deleteChat.length < 2) {
        console.log('emma');
        req.user.id !== usersId[0]
          ? chat.deleteChat.push(usersId[0])
          : chat.deleteChat.push(usersId[1]);
        await chat.save();
      }
    }
    return res.status(201).redirect(`/message/${chat._id}`);
  }

  chat = await Chat.create(req.body);
  res.status(201).redirect(`/message/${chat._id}`);
};

export const getChats = async (req, res) => {
  const chats = await Chat.find({
    usersId: req.user.id,
    deleteChat: req.user.id,
  });
  res.status(200).json(chats);
};

export const getChat = async (req, res) => {
  const chat = await Chat.find({ _id: req.params.id });
  res.status(200).json(chat);
};

export const deleteChat = async (req, res) => {
  // req.params.id is the _id of the chat while req.user.id is the userId
  const chat = await Chat.findOne({ usersId: req.params.id });

  if (!chat) {
    throw new NotFoundError(`no item with id ${req.params.id}`);
  }

  if (chat.deleteChat.length > 1) {
    chat.deleteChat = chat.deleteChat.filter((item) => item !== req.user.id);
    await chat.save();
    return res.status(200).json('chat delete');
  }

  // Takes the userId === req.user.id and responseId === usersId
  // checkPermission(req, userId, responseId)
  checkPermission(req, req.user.id, chat.deleteChat[0]);
  await chat.remove();
  res.status(200).json('chat deletedd');
};
