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
  const currentDate = new Date();
  console.log(currentDate);
  let imgpath = path.join(
    __dirname,
    "../../uploads",
    username,
    projectname
  );
  console.log(username, filename, projectname, imgpath,);
  const query = 'INSERT INTO photos (image_name, project_id, image_path, author, LastUpdated) VALUES (?, ?, ?, ?, ?)';
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
        pool.query('select * from photos where image_name=? and project_id=?', [file,projectname], (err, data) => {
               if (err) {
                   console.log(err)
               }
               if(data.length!=0)
               {
                  console.log(data)
               }
               else
               {
                pool.query(query, [file, projectname, imgurl, username, currentDate], (err, results) => {
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
  const projectname = req.query.projectname;
  //const filename= req.query.filename;
  const path2file = path.join(
    __dirname,
    "../../uploads",
    username,
    projectname
  );
  console.log(username, projectname, path2file);
  // Set the filename as a custom header
  // res.setHeader('x-filename', filename);
  const images = [];
  fs.readdirSync(path2file).forEach((file) =>{
    if(file != "requirements"){
      let imgurl = path.join(
        __dirname,
        "../../uploads",
        username,
        projectname,
        file
      );
      console.log(imgurl);
      imgurl=`/uploads/${username}/${projectname}/${file}`;
      console.log(imgurl);
      images.push(imgurl);
      // res.download(path2file,file, (err) => {
      //   if (err) {
      //     console.log(err);
      //     res.status(500).send(err);
      //     return;
      //   } else {
      //     console.log("send work");
      //     console.log(file);
      //   }
      // });
    }
  });
  console.log(images);
  res.json({ images });
});


router.post("/deleteimg", (req, res) => {
  const username = req.query.username;
  const projectname = req.query.projectname;
  const imageName = req.body.filename;
  const fileName = path.basename(imageName);
  console.log(username, projectname, fileName);
  const folderPath = path.join(
    __dirname,
    "../../uploads",
    username,
    projectname
  );
  const imagePath = path.join(folderPath, fileName);
  const delsql = "delete from  photos where image_name = ?" ;
  pool.query(delsql, [fileName], (err, data) => {
    if (err) console.log("delete image error.");
    else console.log("delete image success.");
  });
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('刪除圖片失敗');
    }
    res.status(200).send('圖片刪除成功');
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
  const requirement_path = JSON.stringify(req.body.request);
  const projectname = req.query.projectname;
  const filePath = path.join(__dirname,
    "../../uploads",
    username,
    projectname,
    "requirements",
  );
  const currentDate = new Date();
  console.log(currentDate);
  console.log(username, projectname, filePath);
  if (!fs.existsSync(filePath)){
    fs.mkdirSync(filePath);
  }
  // let count = 1;
  // let fileName = 'requirements' + count.toString() + '.json';
  // while (fs.existsSync(path.join(filePath, fileName))) {
  //   count++;
  //   fileName = 'requirements' + count.toString() + '.json';
  // }
  const fileNames = 'requirements.json';
  const finalpath = path.join(filePath,fileNames);
  const writecontent = requirement_path;
  fs.writeFile(finalpath, writecontent, (err) => {
    if (err) {
      console.error('發生錯誤：', err);
    } else {
      console.log(`成功新增檔案：${finalpath}`);
    }
  });
  
  const insert = 'INSERT INTO requirements (project_id, requirement_path, author, LastUpdated) VALUES (?, ?, ?, ?)';
  pool.query('select id from projects where project_name=?', [projectname], (err, data) => {
    if (err) {
        console.log(err);
    }
    if(data.length>0)
    {
      const project_id=data[0].id;
      const currentDate = new Date();
      console.log(currentDate);
      
      console.log(requirement_path);
      console.log(finalpath);
      pool.query(insert, [project_id, finalpath, username, currentDate], (err, results) => {
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

router.get("/getrequirement", (req, res) => {
  const username = req.query.username;
  const projectname = req.query.projectname;
  const path2file = path.join(
    __dirname,
    "../../uploads",
    username,
    projectname,
    "requirements"
  );
  console.log(username, projectname, path2file);
  let content = [];
  const startKeyword1 = '"Requirement1":{';
  const endKeyword1 = ',"Requirement2"';
  const startKeyword2 = '"Requirement2":{';
  const endKeyword2 = ',"ID"';

  let filePath = path.join(path2file, 'requirements.json');
  console.log(filePath);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('讀取檔案時發生錯誤:', err);
      return res.status(500).json({ error: '讀取檔案時發生錯誤' });
    }

    const startIndex = data.indexOf(startKeyword1);

    if (startIndex !== -1) {
      const endIndex = data.indexOf(endKeyword1, startIndex);

      if (endIndex !== -1) {
        const selectedContent = data.slice(startIndex, endIndex);
        console.log('所需範圍的內容：', selectedContent);
        content.push(selectedContent);
      } else {
        console.log(`未找到 "${endKeyword1}"。`);
      }
    } else {
      console.log(`未找到 "${startKeyword1}"。`);
    }

    const startIndex2 = data.indexOf(startKeyword2);

    if (startIndex2 !== -1) {
      const endIndex = data.indexOf(endKeyword2, startIndex2);

      if (endIndex !== -1) {
        const selectedContent = data.slice(startIndex2, endIndex);
        console.log('所需範圍的內容：', selectedContent);
        content.push(selectedContent);
      } else {
        console.log(`未找到 "${endKeyword2}"。`);
      }
    } else {
      console.log(`未找到 "${startKeyword2}"。`);
    }

    console.log(content);
    res.json({ content });
  });
});


module.exports = { router };
