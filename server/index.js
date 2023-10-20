const express = require('express')
const path = require('path')
const { WebSocket } = require('ws')
const bodyParser=require('body-parser')
const app = express()
const api = require('./routes/api')

//* server setup
app.use(bodyParser.json({limit:'100mb'}));

// app.use(express.static(path.join(__dirname, '../client')))
app.use('/api', api.router)



//* open server
const port = process.env.PORT || 8080
const server = app.listen(port, () => { console.log('working to open') })

//* websocket
const wss = new WebSocket.Server({ server })
wss.on('connection', (ws) => {
    console.log('client connected')

    //! message from client
    ws.on('message', (message) => {
        console.log(message)





    })

    //! disconnect
    ws.on('close', () => {
        console.log('leave socket')
    })
})