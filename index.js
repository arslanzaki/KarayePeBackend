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
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();


const io = new Server(httpServer, { /* options */ });

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

app.listen(PORT, console.log(`Server Port: ${PORT}`));
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"));

io.on("connection", (socket) => {
  console.log("USER CONNECTED - ", socket.id);

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED - ", socket.id);
  });

  socket.on("join_room", (data) => {
    console.log("USER WITH ID - ", socket.id, "JOIN ROOM - ", data.roomid);
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    console.log("MESSAGE RECEIVED - ", data);
    io.emit("receive_message", data);
  });
});

httpServer.listen(3001);
