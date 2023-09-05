console.log("open")
process.on('message', (message)=>{
    console.log('message from server:', message)
    process.send('hi!')
})