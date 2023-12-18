const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const sequelize = require("./config/sequelize");
const User = require("./models/user");
const { v4: uuidv4 } = require("uuid");

const votingContract = require("../build/contracts/VotingSystem.json");
const { Web3 } = require("web3");
const ganacheUrl = "HTTP://127.0.0.1:7545";
const privateKey =
  "0x7e714a5c55233c1adc7400de839ece13c124d433b1266178211e948ffa1f7a5d";
const { contractAddress } = require('../config-server');

const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));
const contract = new web3.eth.Contract(
  votingContract.abi,
  contractAddress
);
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

const changeEventDateStatus = async () => {
  // Add your code logic here

  // Call the getAllEvent function in smart contract
  const eventList = await contract.methods.getAllEvent().call();

  const currentTime = getCurrentDateTimeInMalaysia();
  const unixCurrentTime = new Date(currentTime).getTime() / 1000;
  if (eventList != null) {
    for (const event of eventList) {
      try {
        if (
          unixCurrentTime >= event.startDateTime &&
          unixCurrentTime <= event.endDateTime &&
          event.status != 2
        ) {
          console.log("change status to processing");
          event.status = 2; // 1: Upcoming, 2: In Progress, 3: Completed, 4: Cancel
          await contract.methods.updateEvent(event).send({
            from: account.address,
            gas: 200000,
          });
          break;
        } else if (
          unixCurrentTime > event.endDateTime &&
          event.status != 3 &&
          event.status != 4
        ) {
          console.log("change status to completed!");
          event.status = 3; // 1: Upcoming, 2: In Progress, 3: Marking Wiiner, 4: Completed, 5: H   as no candidate
          await contract.methods.updateEvent(event).send({
            from: account.address,
            gas: 200000,
          });
          break;
        }
      } catch (error) {
        console.error("Error change event status : ", error.message);
      }
    }
  }
};
setInterval(changeEventDateStatus, 1000);

const markingWinner = async () => {
  // Add your code logic here

  // Call the getAllEvent function in smart contract
  const eventList = await contract.methods.getAllEvent().call();
  if (eventList != null) {
    for (const event of eventList) {
      if (event.status == 3 && event.candidates!=null) {
        const isMarkedWinner = await contract.methods
          .isMarkWinner(event.categoryId, event.eventId)
          .call();

        if (!isMarkedWinner) {
          console.log("Marking Winner");
          try {
            await contract.methods
              .markWinner(event.categoryId, event.eventId)
              .send({
                from: account.address,
                gas: 200000,
              });

            event.status = 4; // 1: Upcoming, 2: In Progress, 3: Marking Wiiner, 4: Completed
            await contract.methods.updateEvent(event).send({
              from: account.address,
              gas: 200000,
            });
            console.log("Marking End");
          } catch (error) {
            console.error("Error counting winner : ", error.message);
          }
          event.status = 4; // 1: Upcoming, 2: In Progress, 3: Marking Wiiner, 4: Completed
          await contract.methods.updateEvent(event).send({
            from: account.address,
            gas: 200000,
          });
          console.log("Marking End");
        }
      }
    }
  }
};

setInterval(markingWinner, 1000);

function getCurrentDateTimeInMalaysia() {
  // Get the current date and time in UTC
  const now = new Date();
  // Convert it to Malaysia time (UTC+8)
  const malaysiaTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  // Format the date and time to be suitable for the datetime-local input
  const formattedDateTime = malaysiaTime.toISOString().slice(0, 16);
  return formattedDateTime;
}

// Allowed origins for CORS
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

// Configure Multer to save files in the uploads directory with size limit
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const originalname = path.parse(file.originalname);
    const randomString = uuidv4(); // Generate a random string using uuid
    const filename = randomString + originalname.ext;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB file size limit
  fileFilter: function (req, file, cb) {
    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".gif") {
      return cb(
        new Error("Only .png, .jpg, .jpeg, and .gif files are allowed")
      );
    }
    cb(null, true);
  },
});

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["POST", "GET", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "userId",
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      expires: 60 * 60 * 24 * 1000,
      httpOnly: true,
    },
  })
);

const userRouter = require("./routes/userRoute");
const webRouter = require("./routes/webRoute");

app.use("/api", userRouter);
app.use("/", webRouter);

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filename = req.file.filename;
    res.status(200).json({ imageFileName: filename });
  } catch (error) {
    console.error("Error Msg : ", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/deleteFile", async (req, res) => {
  const { filename } = req.body;
  console.log("Attempting to delete file:", filename);
  try {
    const filePath = path.join("uploads", filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file: ", err);
        return res.status(500).send("Internal Server Error");
      }
      res.status(200).send("File deleted successfully.");
    });
  } catch (error) {
    console.error("Error Msg : ", error.message);
    res.status(500).send("Internal Server Error");
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    return sequelize.sync();
  })
  .then(() => {
    console.log("Database & tables created!");
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((err) => {
    console.error("Error during Sequelize sync or server start: ", err);
  });

// Error handling for file upload issues
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File size limit is 1MB" });
  } else if (err.message === "Only images are allowed") {
    return res.status(400).json({ message: "Only images are allowed" });
  }
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({ message: err.message });
});

module.exports = app;
