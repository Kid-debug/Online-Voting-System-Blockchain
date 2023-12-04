const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["POST", "GET", "PUT", "DELETE"],
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true, // Because the Access-Control-Allow-Credentials: true header is needed
};

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const sequelize = require("./config/sequelize");
const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

const userRouter = require("./routes/userRoute");
const webRouter = require("./routes/webRoute");
const verifyJWT = require("./middleware/verifyJWT");

app.use(express.json());

app.use(bodyParser.json());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "secret", // the key will sign the cookie to the browser
    resave: false, // for every request to the server we want to create a new session even if we don't care about if it's the same user or browser and we don't want this
    saveUninitialized: false, // if we have not touched or modified the session, we don't want it to save
    cookie: {
      secure: false,
      expires: 60 * 60 * 24 * 1000,
      httpOnly: true,
    }, // set the session cookie properties
  })
);

app.use(cors(corsOptions));

app.use("/api", userRouter);
app.use("/", webRouter);
// Your GET route to verify the token
app.get("/api/verifyToken", verifyJWT, (req, res) => {
  // If the middleware doesn't send a response, it means the token is valid
  res.status(200).send("You have accessed a protected route");
});

// Test database connection and sync models
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    return sequelize.sync(); // Syncs all models
  })
  .then(() => {
    console.log("Database & tables created!");
    // Start the server after database sync
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((err) => {
    console.error("Error during Sequelize sync or server start: ", err);
  });

// Error handling
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});
