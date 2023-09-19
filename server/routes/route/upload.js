const express = require('express')
const multer = require("multer");
const path = require('path');
const router = express.Router()
const { pool, storage } = require('../../src/database.js');

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    console.log(req.method, req.url)
    next()
})

//* upload image to SQL
const upload = multer({ storage: storage })
router.post('/upload', upload.array('file'), (req, res) => {
    // //! prepare
    const username = req.query.username
    const filename = req.files[0].filename;
    const imgpath = path.join(__dirname, '../../uploads', username, filename)
    console.log(username, filename, imgpath)

    // //! insert image(buffer)
    // const query = 'INSERT INTO photo (file_name, image_data) VALUES (?, LOAD_FILE(?))';
    // pool.query(query, [filename, imgpath], (err, results) => {
    //     if (err) throw err;
    //     console.log(results.insertId)
    //     res.json({ message: 'Image uploaded successfully!', id: results.insertId });
    //     //!　test => search image(buffer=>binary)
    //     // pool.query('select * from photo where file_name=?', [filename], (err, data) => {
    //     //     if (err) {
    //     //         console.log(err)
    //     //     }
    //     //     console.log(data)
    //     // })
    // });

    //! test
    // const test = req.query.username
    // console.log(test)
    
    res.send("test work")
});

//* download image from SQL
router.get('/download', (req, res) => {
    //! prepare
    const username = req.query.username
    const filename = req.query.filename
    const path2file = path.join(__dirname, '../../uploads', username, filename)
    console.log(path2file)
    res.download(path2file, (err) => {
        if (err) {
            console.log(err)
            res.status(500).send(err)
            return
        }
        else {
            console.log('send work')
        }
    })

    //! test
    // const test = req.query.filename
    // const test2 = req.query.username
    // console.log(test, test2)
    // res.send("test work")

})

//TODO search under the user of files



module.exports = { router }