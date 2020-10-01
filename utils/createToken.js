const jwt = require("jsonwebtoken");

function createToken(id) {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE_IN
    })
}

module.exports = createToken;