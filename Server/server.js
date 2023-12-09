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

// Allowed origins for CORS
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

// Configure Multer to save files in the uploads directory with size limit
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const originalname = path.parse(file.originalname);
    const hash = crypto
      .createHash("md5")
      .update(originalname.name)
      .digest("hex");
    const filename = hash + originalname.ext;
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
  if (!req.file) {
    return res
      .status(400)
      .send(
        "File upload error: No file uploaded or file is not an image or too large"
      );
  }

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
    return res.status(400).send("File size limit is 1MB");
  } else if (err.message === "Only images are allowed") {
    return res.status(400).send("Only images are allowed");
  }
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({ message: err.message });
});

module.exports = app;
