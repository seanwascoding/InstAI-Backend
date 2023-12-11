const mysql = require("mysql2");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const pool = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "37361636",
  database: "test",
  port:"3307"
});
pool.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

//* setup download destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // pool.query('select id from login where email=?', [req.query.username], (err, data) => {
    //        if (err) {
    //            console.log(err)
    //        }
    //        console.log(data)
    //  })
    const username = req.query.username;
    const projectname = req.query.projectname;
    //console.log(file.originalname);
    const dir = path.join(__dirname, "../uploads", username, projectname);
    console.log(projectname);
    // if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    //   dir = path.join(__dirname, "../uploads", username, "model");
    // }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

module.exports = { pool, storage };
