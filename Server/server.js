const express = require("express");
const app = express();
const cors = require("cors");
// Specific Origin
const corsOptions = {
  origin: "http://localhost:5173", // Only allow this origin
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true, // Because the Access-Control-Allow-Credentials: true header is needed
};

const bodyParser = require("body-parser");
require("./config/dbConnection");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

const userRouter = require("./routes/userRoute");
const adminRouter = require("./routes/adminRoute");
const webRouter = require("./routes/webRoute");

app.use(express.json());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.use("/api", userRouter);
app.use("/api", adminRouter);
app.use("/", webRouter);

// Error handling
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
