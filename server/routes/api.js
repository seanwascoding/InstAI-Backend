const express = require('express')
const router = express.Router()

//* routes
const img2img = require('./route/img2img.js')
const txt2img = require('./route/txt2img.js')
const test = require('./route/test.js')
const queue = require('./route/queue.js')
const account = require('./route/account.js')
const upload = require('./route/upload.js')
const project= require('./route/project.js')

//* api
router.use('/img2img', img2img.router)
router.use('/txt2img', txt2img.router)
router.use('/test', test.router)
router.use('/queue', queue.router)
router.use('/account', account.router)
router.use('/upload', upload.router)
router.use('/project', project.router)

module.exports = { router }