const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


io.on('connection', socket => {
    console.log("fdp joined");

    socket.on("message", m =>{
        console.log(m)
    })
});


http.listen(4444, () => {
    console.log('Listening on port 4444');
});
