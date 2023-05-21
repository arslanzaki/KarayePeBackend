const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const multer = require("multer");

const authRoutes = require("./routes/auth");
const adRoutes = require("./routes/ad");
const messageRoutes = require("./routes/message");
const createAd = require("./controllers/ad").createAd;
const verifyToken = require("./middleware/auth");
const { fileURLToPath } = require("url");
const socket = require("socket.io");
const { setProfilePicture } = require("./controllers/auth");

// CONFIGURATIONS

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// ROUTES WITH FILES
app.post("/ads", upload.single("picture"), createAd);
app.put("/auth/profilePicture", upload.single("picture"), setProfilePicture);
// ROUTES
app.use("/auth", authRoutes);
app.use("/ads", adRoutes);

app.use("/messages", messageRoutes);

const PORT = process.env.PORT || 6000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = app.listen(PORT, console.log(`Server Port: ${PORT}`));
    const io = socket(server, {
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });
    global.onlineUsers = new Map();
    io.on("connection", (socket) => {
      global.chatSocket = socket;
      socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
      });
      socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.io);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
      });
    });
  })
  .catch((err) => console.log(err));
