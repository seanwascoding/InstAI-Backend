const express = require('express')
const router = express.Router()

//* routes
const img2img = require('./route/img2img.js')
const test = require('./route/test.js')
const queue = require('./route/queue.js')

//* api
router.use('/img2img', img2img.router)
router.use('/test', test.router)
router.use('/queue', queue.router)

module.exports = { router }