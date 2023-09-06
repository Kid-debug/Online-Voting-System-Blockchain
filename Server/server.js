import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fyp",
});

con.connect(function (err) {
  if (err) {
    console.log("Error in Connection");
  } else {
    console.log("Connected");
  }
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not Authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) return res.json({ Error: "Token wrong" });
      next();
    });
  }
};

app.get("/dashboard", verifyUser, (req, res) => {
  return res.json({ Status: "Success" });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users Where email = ? AND password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err)
      return res.json({ Status: "Error", Error: "Error in running query" });
    if (result.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        result[0].password,
        (err, response) => {
          if (err) return res.json({ Error: "password error" });
          const id = result[0].id;
          const token = jwt.sign({ id }, "jwt-secret-key", { expiresIn: "1d" });
          res.cookie("token", token);
          return res.json({ Status: "Success" });
        }
      );
    } else {
      return res.json({ Status: "Error", Error: "Wrong Email or Password" });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.listen(8081, () => {
  console.log("Running");
});
