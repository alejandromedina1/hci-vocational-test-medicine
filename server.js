const express = require('express')
const { Server } = require('socket.io')
const PORT = 8080;

const expressApp = express ();
expressApp.use(express.json())
expressApp.use('/mobile', express.static('public-mobile'));

expressApp.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/mobile`)
})

// First run on terminal: npm start
// To run on terminal: ngrok http 5050

/*const io = new Server(httpServer, { path: '/real-time' })

io.on('connection', (socket) => {
    console.log('Connected', socket.id)

    socket.on('coords', (point) => {
        console.log(point);
    })
})

*/

