const _io = require('socket.io');
const cookie = require('cookie');
const catchAsync = require("../utils/catchAsync.util");
const User = require("../models/User.model");
const { promisify } = require('util');
const jwt = require('jsonwebtoken');


const customers = {};
const admins = {};
const users = {};

function chat(server) {
    const io = _io(server);
    
    
    
    io.on('connection', (socket) => {
        let user = null;
        socket.on('addUser',async(token)=>{
            let decoded;
            
            if (token){
                decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            }else{
                const cookies = cookie.parse(socket.handshake.headers.cookie);
                if(!cookies.jwt)return;
                decoded = await promisify(jwt.verify)(cookies.jwt, process.env.JWT_SECRET);
                console.log({decoded})
            }

            if(!decoded.id)return;
            
    
    
            user = await User.findById(decoded.id);
    
            if (!user) return;
            user.id = String.toString(user._id);
            users[user.id] = socket;
            console.log([...Object.keys(users)])
    
            io.emit('active', [...Object.keys(users)])
        });

        

        socket.on('getActive', () => {
            socket.emit('active', [...Object.keys(users)])
        })

        socket.on('disconnect', () => {
            if(!user)return;
            delete users[user.id]
            io.emit('active', [...Object.keys(users)])

        });

        socket.on('chat', (data) => {
            console.log(data);
            if (users[data.to]) {
                users[data.to].emit('chat', data)
            }
        });

        socket.on('typeing',(data)=>{
            if(users[data.to]){
                users[data.to].emit('typeing', {status: data.status})
            }
            console.log(data)
        });

        // socket.on('message', (data) => {
        //     const adminIds = Object.keys(admins)
        //     if (adminIds.includes(user.id)) {
        //         if (!customers[data.id]) return;
        //         const conn = customers[data.id];
        //         conn.emit('message', { message: data.message, id: user.id })
        //     } else {
        //         if (data.id) {
        //             admins[data.id].emit('message', { message: data.message, id: user.id })
        //         } else {
        //             adminIds.forEach(key => {
        //                 admins[key].emit('message', { message: data.message, id: user.id })
        //             })
        //         }
        //     }
        // });

    })
}

module.exports = chat;