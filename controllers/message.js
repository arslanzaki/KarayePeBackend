const Message = require("./../models/Message");
const User = require("./../models/User");

const saveMessageToDB = async (req, res) => {
  const { senderid, message, roomid, recieverid } = req.body;
  console.log("MESSAGE RECEIVED - ", req.body);
  try {
    const newMessage = new Message({
      senderid,
      message,
      roomid,
      recieverid,
    });
    await newMessage.save();
    res.send({ message: "Message saved successfully" });
  } catch (err) {
    res.status(422).send(err.message);
  }
};

const getMessages = async (req, res) => {
  const { roomid } = req.body;
  console.log("ROOM ID RECEIVED - ", roomid);

  Message.find({ roomid: roomid })
    .then((messages) => {
      res.status(200).send(messages);
    })
    .catch((err) => {
      console.log(err);
    });
};

const setUserMessages = async (req, res) => {
  try {
    const { message, roomid, senderid, recieverid } = req.body;
    console.log("MESSAGE ID RECEIVED - ", recieverid);
    const user = await User.findOne({ _id: senderid }).exec();

    if (user.allmessages.length) {
      user.allmessages.map((item) => {
        if (item.recieverid === recieverid) {
          user.allmessages.pull(item);
        }
      });
    }
    const date = Date.now();
    user.allmessages.push({ senderid, recieverid, message, roomid, date });

    await user.save();
    // await otherUser.save();
    res.status(200).send({ message: "Message saved successfully" });
  } catch (err) {
    console.log(err);
    res.status(422).send(err.message);
  }
};

const getUserMessages = async (req, res) => {
  const { userid } = req.body;
  console.log("USER ID RECEIVED - ", userid);
  User.findOne({ _id: userid })
    .then((user) => {
      res.status(200).send(user.allmessages);
    })
    .catch((err) => {
      console.log(err);
      res.status(422).send(err.message);
    });
};

module.exports = {
  getMessages,
  getUserMessages,
  setUserMessages,
  saveMessageToDB,
};
