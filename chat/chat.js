const _io = require('socket.io');
const cookie = require('cookie');
const User = require("../models/User.model");
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Group = require('../models/Group.model');



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
            }

            if(!decoded.id)return;
            
    
    
            user = await User.findById(decoded.id);
    
            if (!user) return;
            user.id = String.toString(user._id);
            users[user.id] = socket;
    
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

        socket.on('addToGroup',async(data)=>{
            if(!user)return;
            const group = await Group.findById(data.id);
            if(!group)return;
            
            if(group.members.includes(user.id)){
                socket.join(group._id);
            }

        });

        socket.on('chat', (data) => {
                if(users[data.to]){
                    if(data.type === 'group'){
                        socket.to(data.to).emit('chat',data)
                    }else{
                        users[data.to].emit('chat', data)
                    }
                }
        });

        socket.on('typeing',(data)=>{
            if(users[data.to]){
                users[data.to].emit('typeing', {status: data.status})
            }
        });

    })
}

module.exports = chat;