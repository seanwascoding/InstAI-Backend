const express = require('express')
const { fork } = require('child_process')
const router = express.Router()

//* open another process
const queue_system = fork('node ../../src/queue_process.js', { stdio: 'ignore' })
queue_system.on('message', (message) => {
    console.log(message)
})

//* test child_process
router.get('/send_process', (req, res) => {
    queue_system.send('test')
    res.status(200).send('work')
})

module.exports = { router }