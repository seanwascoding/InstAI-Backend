const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const { pool } = require("../../src/database.js");

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  console.log(req.method, req.url);
  next();
});
let arr = [];
router.get("/getproject", (req, res) => {
  try {
    arr = [];
    const username = req.query.username;
    const user_path = path.join(__dirname, "../../uploads", username);
    console.log(username, user_path);
    if (fs.existsSync(user_path)) {
      console.log("folder exists");
      fs.readdirSync(user_path).forEach((folder) => {
        console.log(folder);
        arr.push(folder);
      });
      console.log(arr);
    } else {
      fs.mkdirSync(user_path);
    }
    res.status(200).json(arr);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post("/addproject", (req, res) => {
  const username = req.query.username;
  const projectname = req.body.projectName;
  console.log(projectname);
  const previousDir = path.join(__dirname, "..");
  const dir = path.join(previousDir, "../uploads", username, projectname);
  const sql =
    "CREATE TABLE " +
    projectname +
    "(  id INT AUTO_INCREMENT PRIMARY KEY,  file_name VARCHAR(255) NOT NULL,image_data LONGBLOB NOT NULL,requirements VARCHAR(255))";
  pool.query(sql, null, (err, data) => {
    if (err) console.log("table exists.");
    else console.log("create success.");
  });
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    res.send("新增成功!");
  } else {
    res.send("專案已存在!");
  }
});

router.post("/deleteproject", (req, res) => {
  const username = req.query.username;
  console.log(username);
  const projectname = req.body.projectName;
  console.log(projectname);
  const previousDir = path.join(__dirname, "..");
  const dir = path.join(previousDir, "../uploads", username, projectname);
  const sql = "DROP TABLE " + projectname ;
  pool.query(sql, [projectname], (err, data) => {
    if (err) console.log("table does not exist.");
    else console.log("table delete success.");
  });
  try {
    // Use recursive option to remove the directory and its contents
    fs.rmdirSync(dir, { recursive: true });
    res.send("專案已刪除!"); // Project has been deleted
  } catch (err) {
    console.error("Error deleting directory:", err);
    res.status(500).send("刪除專案時發生錯誤"); // Error occurred while deleting
  }
});

module.exports = { router };
