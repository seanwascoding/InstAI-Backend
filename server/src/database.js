const mysql = require("mysql2");

const pool = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: "test"
})
pool.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});

//* setup download destination
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Destination folder for uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname); // Unique filename for each uploaded image
    },
});

module.exports = { pool, storage }