const webtoken = require('../middleware/webtoken');
const { findUserByUsername } = require('../models/user');
const _ = require('lodash');
const { hashPassword, verifyPassword } = require('../middleware/hash');

loginUser = async (req, res) => {
    user = req.body;
    const result = await findUserByUsername(user);
    if(!verifyPassword(user.password, result.password)){
        res.json({err: "Password or username incorrect"});
        return;
    }

    if(result == null){
        res.json({ err: "Wrong username or password!"}).status(403);
        return;
    }

    if(req.payload) {
        if(req.payload._id == result._id && req.payload.username == result.username){
            res.json(_.pick(result, ['_id', 'username','email']));
            return;
        }
        console.log(req.payload);
        res.json("Token not valid!");
        return;
    }
  
    const token = webtoken.createToken(_.pick(result, '_id', 'username'));
    res.header('x-auth', token).status(200);
    res.json(_.pick(result, ['_id', 'username','email']));
    
}



module.exports = { loginUser }