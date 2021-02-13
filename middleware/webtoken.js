const jwt = require('jsonwebtoken');
const secret = process.env.TOKEN_SECRET;



createToken = (data) => {
    const token = jwt.sign(data, secret);
    return token;
}

checkTokenValidity = (req, res, next) => {
    const token = req.header('x-auth');
    console.log(token);
    if(!token) return next();
        
    const checked = jwt.verify(token, secret);
    req.payload = checked;
    next();
}


module.exports = { createToken, checkTokenValidity }