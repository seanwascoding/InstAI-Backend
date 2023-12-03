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
  const projectname = req.query.projectname;
  let imgpath = path.join(
    __dirname,
    "../../uploads",
    username,
    projectname
  );
  console.log(username, filename, projectname, imgpath,);
  const sql =
    "CREATE TABLE photos" +
    "(  id INT AUTO_INCREMENT PRIMARY KEY, file_name VARCHAR(255) NOT NULL, project_id VARCHAR(255) NOT NULL,photo_url VARCHAR(255) NOT NULL)";
  const query = 'INSERT INTO photos (file_name, project_id, photo_url) VALUES (?, ?, ?)';
  pool.query(sql, null, (err, data) => {
    if (err) console.log("photos table exists.");
    else console.log("photos create success.");
  });
  //! insert image(buffer)
  if (fs.existsSync(imgpath)) {
    console.log("folder exists");
    fs.readdirSync(imgpath).forEach((file) => {
      console.log(file);
      if(file != "requirements"){
        let imgurl = path.join(
          __dirname,
          "../../uploads",
          username,
          projectname,
          file
        );
        console.log(imgpath);
        pool.query('select * from photos where file_name=? and project_id=?', [file,projectname], (err, data) => {
               if (err) {
                   console.log(err)
               }
               if(data.length!=0)
               {
                  console.log(data)
               }
               else
               {
                pool.query(query, [file, projectname, imgurl], (err, results) => {
                  if (err) throw err;
                  console.log(results.insertId)
                });
               }    
        })
      }
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

router.post("/requirement", (req, res) => {
  // //! prepare
  const username = req.query.username;
  const requirements = req.body.request.req;
  const question= req.body.question;
  const projectname = req.query.projectname;
  const filePath = path.join(__dirname,
    "../../uploads",
    username,
    projectname,
    "requirements",
  );
  
  console.log(username, requirements, question, projectname, filePath);
  if (!fs.existsSync(filePath)){
    fs.mkdirSync(filePath);
  }
  let count = 1;
  let fileName = 'requirements' + count.toString() + '.txt';

  while (fs.existsSync(path.join(filePath, fileName))) {
    count++;
    fileName = 'requirements' + count.toString() + '.txt';
  }
  const finalpath = path.join(filePath,fileName);
  const writecontent = question + "\n" + requirements;
  fs.writeFile(finalpath, writecontent, (err) => {
    if (err) {
      console.error('發生錯誤：', err);
    } else {
      console.log(`成功新增檔案：${finalpath}`);
    }
  });
  const sql =
    "CREATE TABLE requirements" +
    "(  id INT AUTO_INCREMENT PRIMARY KEY,  project_id VARCHAR(255) NOT NULL, question VARCHAR(255) NOT NULL, content VARCHAR(255) NOT NULL)";
  pool.query(sql, null, (err, data) => {
      if (err) console.log("requirements table exists.");
      else console.log("requirements create success.");
  });
  const insert = 'INSERT INTO requirements (project_id, question, content) VALUES (?, ?, ?)';
  pool.query('select id from projects where project_name=?', [projectname], (err, data) => {
    if (err) {
        console.log(err);
    }
    if(data.length>0)
    {
      const project_id=data[0].id;
      pool.query(insert, [project_id, question, requirements], (err, results) => {
        if (err) throw err;
        console.log(results.insertId);
      });
    }
    else
    {
      console.log("project not found.");
    }
  })
  
  res.json({ message: 'requirement uploaded successfully!'});  

});



module.exports = { router };
