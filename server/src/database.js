const mysql = require("mysql2");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const pool = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "",
});
pool.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

//* setup download destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const username = req.query.username;
    const dir = "";
    console.log(file.originalname);
    if (file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      dir = path.join(__dirname, "../uploads", username, "image");
    } else {
      dir = path.join(__dirname, "../uploads", username, "model");
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

module.exports = { pool, storage };
