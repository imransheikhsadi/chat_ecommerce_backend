const _io = require('socket.io');
const cookie = require('cookie');
const catchAsync = require("../utils/catchAsync.util");
const User = require("../models/User.model");
const { promisify } = require('util');
const jwt = require('jsonwebtoken');


const customers = {};
const admins = {};

function chat(server) {
    const io = _io(server);

    
    
    io.on('connection', async(socket) => {
        const cookies = cookie.parse(socket.handshake.headers.cookie);

        if(!cookies.jwt)return;

        const decoded = await promisify(jwt.verify)(cookies.jwt, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!user)return;
        user.id = String.toString(user._id);

        if(user.role === 'admin' || user.role === 'moderator'){
            admins[user.id] = socket;
        }else{
            customers[user.id] = socket;
        }
        
        socket.on('message',(data)=>{
            const adminIds = Object.keys(admins) 
            if(adminIds.includes(user.id)){
                if(!customers[data.id])return;
                const conn = customers[data.id];
                conn.emit('message',{message: data.message,id: user.id})
            }else{
                if (data.id) {
                    admins[data.id].emit('message',{message: data.message,id: user.id})
                }else{
                    adminIds.forEach(key=>{
                        admins[key].emit('message',{message: data.message,id: user.id})
                    })
                }
            }
        });

    })
}

module.exports = chat;