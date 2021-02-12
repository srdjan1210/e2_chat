const webtoken = require('../middleware/webtoken');
const { findUserByUsername } = require('../models/user');
const _ = require('lodash');
const { hashPassword, verifyPassword } = require('../middleware/hash');

loginUser = async (req, res) => {
    user = req.body;
    const result = await findUserByUsername(user);
    
    if(result == null){
        res.status(403).send({ err: "Wrong username or password!"});
        return;
    }

    if(!(await verifyPassword(user.password, result.password))){
        res.status(403).send({err: "Password or username incorrect"});
        return;
    }


    if(req.payload) {
        if(req.payload._id == result._id && req.payload.username == result.username){
            res.send(_.pick(result, ['_id', 'username','email']));
            return;
        }
        console.log(req.payload);
        res.status(403).send("Token not valid!");
        return;
    }
  
    const token = webtoken.createToken(_.pick(result, '_id', 'username'));
    res.header('x-auth', token).status(200);
    res.send(_.pick(result, ['_id', 'username','email']));
    
}



module.exports = { loginUser }