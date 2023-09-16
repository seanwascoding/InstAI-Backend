const mysql = require("mysql2");
const multer = require("multer");
const fs = require('fs')
const path = require('path')

const pool = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'Amks94884674?',
    database: "test"
})
pool.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});

//* setup download destination
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const username = req.query.username
        const dir = path.join(__dirname, '../uploads', username)
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true })
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    },
});

module.exports = { pool, storage }