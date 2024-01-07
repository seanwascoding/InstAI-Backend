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
  const login = "CREATE TABLE login( id INT AUTO_INCREMENT PRIMARY KEY,  firstname VARCHAR(255),  lastname VARCHAR(255),  email VARCHAR(255),  password VARCHAR(255))";
  pool.query(login, null, (err, data) => {
    if (!err)
      console.log("login create success.");
  });
  const photos =
    "CREATE TABLE photos" +
    "(  id INT AUTO_INCREMENT PRIMARY KEY, image_name VARCHAR(255) NOT NULL, project_id VARCHAR(255) NOT NULL,image_path VARCHAR(255) NOT NULL, author VARCHAR(255) NOT NULL, LastUpdated VARCHAR(255) NOT NULL)";
  pool.query(photos, null, (err, data) => {
    if (!err)
      console.log("photos create success.");
  });
  const projects =
    "CREATE TABLE " +
    "projects" +
    "(  id INT AUTO_INCREMENT PRIMARY KEY,  user_id VARCHAR(255) ,organization_id VARCHAR(255),project_name VARCHAR(255),  step VARCHAR(255))";
  pool.query(projects, null, (err, data) => {
    if (!err)
      console.log("projects create success.");
  });
  const requirements =
    "CREATE TABLE requirements" +
    "(  id INT AUTO_INCREMENT PRIMARY KEY,  project_id VARCHAR(255) NOT NULL, requirement_path VARCHAR(255) NOT NULL, author VARCHAR(255) NOT NULL, LastUpdated VARCHAR(255) NOT NULL, status VARCHAR(255) )";
  pool.query(requirements, null, (err, data) => {
      if (!err)
        console.log("requirements create success.");
  });
  const version =
    "CREATE TABLE version" +
    "(  id INT AUTO_INCREMENT PRIMARY KEY,  project_id VARCHAR(255) NOT NULL, model_path VARCHAR(255) , model_name VARCHAR(255) , performance_path VARCHAR(255) , version_number VARCHAR(255), createtime VARCHAR(255) )";
  pool.query(version, null, (err, data) => {
      if (!err)
        console.log("requirements create success.");
  });
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
