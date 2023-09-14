const express = require('express')
const router = express.Router()
const { pool, storage } = require('../../src/database.js')

//* upload image to SQL
const upload = multer({ storage: storage })
router.post('/upload', upload.array('images', 10), (req, res) => {

    //! 前置處理
    const filename = req.files[0].filename;
    const imgpath = path.join(__dirname, 'uploads', filename)
    console.log(imgpath)
    console.log(filename)

    //! insert image(buffer)
    const query = 'INSERT INTO photo (file_name, image_data) VALUES (?, LOAD_FILE(?))';
    pool.query(query, [filename, imgpath], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Image uploaded successfully!', id: results.insertId });

        //!　test => search image(buffer=>binary)
        // pool.query('select * from photo where file_name=?', [filename], (err, data) => {
        //     if (err) {
        //         console.log(err)
        //     }
        //     console.log(data)
        // })
    });
});

//* download image from SQL
router.get('/download/:filename', (req, res) => {
    console.log('1')
    console.log(req.params.filename)
    const filename = req.params.filename
    const path2file = path.join('model', filename)
    console.log(path2file, filename)
    res.download(path2file, filename, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log('send work')
        }
    })
})

module.exports = { router }