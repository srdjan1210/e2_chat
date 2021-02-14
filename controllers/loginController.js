const webtoken = require('../middleware/webtoken');
const { findUserByUsername } = require('../models/user');
const _ = require('lodash');
const { verifyPassword } = require('../middleware/hash');

loginUser = async (req, res) => {
    user = req.body;
    const result = await findUserByUsername(user);
    
    if(result == null) return res.status(401).send({ err: "Wrong username or password!"});

    if(!(await verifyPassword(user.password, result.password))) return res.status(401).send({err: "Password or username incorrect"});
    if(!req.payload){
        const token = webtoken.createToken(_.pick(result, '_id', 'username'));
        res.header('x-auth', token).status(200);
        return res.send(_.pick(result, ['firstname', 'lastname', 'username', 'email', 'profile_image']));
        
    }

    if(req.payload._id == result._id && 
       req.payload.username == result.username)  return res.send(_.pick(result, ['firstname', 'lastname', 'username', 'email', 'profile_image']));
           
    res.status(403).send({err: "Token not valid"});
  

    
}



module.exports = { loginUser }