const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const { pool, storage } = require("../../src/database.js");

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  console.log(req.method, req.url);
  next();
});

//* upload image to SQL
const upload = multer({ storage: storage });
router.post("/upload", upload.array("file"), (req, res) => {
  // //! prepare
  const username = req.query.username;
  const filename = req.files[0].filename;
  let imgpath = path.join(
    __dirname,
    "../../uploads",
    username,
    "image"
  );
  console.log(username, filename, imgpath);
  const query = 'INSERT INTO photo (file_name, image_data) VALUES (?, LOAD_FILE(?))';
  

  //! insert image(buffer)
  if (fs.existsSync(imgpath)) {
    console.log("folder exists");
    fs.readdirSync(imgpath).forEach((file) => {
      console.log(file);
      imgpath = path.join(
        __dirname,
        "../../uploads",
        username,
        "image",
        file
      );

      pool.query('select file_name from photo where file_name=?', [file], (err, data) => {
             if (err) {
                 console.log(err)
             }
             if(data.length>0)
             {
                console.log(data)
             }
             else
             {
              pool.query(query, [file, imgpath], (err, results) => {
                if (err) throw err;
                console.log(results.insertId)
              });
             }
             
      })
    });
  }
  res.json({ message: 'Image uploaded successfully!'});  

  //! test
  // const test = req.query.username
  // console.log(test)
});

//* download image from SQL
router.get("/download", (req, res) => {
  //! prepare
  const username = req.query.username;
  const filename = req.query.filename;
  //const filename= req.query.filename;
  console.log("123")
  const path2file = path.join(
    __dirname,
    "../../uploads",
    username,
    "image",
    filename
  );
  console.log(username,path2file);
  // Set the filename as a custom header
  // res.setHeader('x-filename', filename);
  res.download(path2file,filename, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
      return;
    } else {
      console.log("send work");
      console.log(filename);
    }
  });
});

//TODO search under the user of files
let arr = [];
router.get("/checkdata", (req, res) => {
  try {
    arr = [];
    const username = req.query.username;
    const check = req.query.check;
    const user_path = path.join(__dirname, "../../uploads", username, check);
    console.log(username, user_path);
    if (fs.existsSync(user_path)) {
      console.log("folder exists");
      fs.readdirSync(user_path).forEach((file) => {
        console.log(file);
        arr.push(file);
      });
      console.log(arr);
    } else {
      console.log("no such folder");
      res.status(500).json("no such folder");
    }
    res.status(200).json(arr);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = { router };
