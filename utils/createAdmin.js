const User = require("../models/User.model");

const admin = {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: 'adminadmin',
    confirmPassword: 'adminadmin',
    role: 'admin'
}

function defaultAdmin() {
    User.countDocuments({},(err,count)=>{
        if(count <= 0){
            User.create(admin,(err)=>{
                throw err;
            })
        }
    });
}

module.exports = defaultAdmin;