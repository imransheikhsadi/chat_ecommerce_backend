const _io = require('socket.io');
const cookie = require('cookie');

function chat(server) {
    const io = _io(server);


    io.on('connection',(socket)=>{
        const cookies = cookie.parse(socket.handshake.headers.cookie);
        console.log({cookies});
    })
}

module.exports = chat;