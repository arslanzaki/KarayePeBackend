const Message = require("./../models/Message");

const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    res.json(projectedMessages);
  } catch (err) {
    next(err);
  }
};

const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const newMessage = new Message({
      message: {
        text: message,
      },
      users: [from, to],
      sender: [from],
    });

    const savedData = await newMessage.save();

    if (savedData) {
      return res.json({ message: "Message Added Successfully!" });
    } else {
      return res.json({ message: "Failed To Add Message To The Database" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { getMessages, addMessage };
