const express = require('express')
const router = express.Router()
const { pool } = require('../../src/database.js')
const fs = require("fs");
const path = require("path");

//* resolve requset
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    console.log(req.method, req.url)
    next()
})

//* signup
router.post('/signup', (req, res) => {
    console.log(req.body)
    const sql = "INSERT INTO login (`firstname`,`lastname`,`email`,`password`) VALUES (?)";
    const values = [
        req.body.fname,
        req.body.lname,
        req.body.email,
        req.body.password
    ]
    
    pool.query(sql, [values], (err, data) => {
        if (err) {
            return res.json("error");
        }
        return res.json("register success!")
    })
})

//* login
router.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE `email`=(?) AND `password`=(?)";
    console.log(req.body)
    const dir = path.join(__dirname, "../../uploads");
    console.log(dir);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    pool.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0) {
            console.log(data[0].id);
            return res.json("Success"+ data[0].id);
        }
        else {
            return res.json("Faile");
        }
    })
})

module.exports = { router }