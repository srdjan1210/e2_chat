const webtoken = require('../middleware/webtoken');
const { findUserByUsername, setUserActiveTime } = require('../models/user');
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
        await setUserActiveTime({username: result.username});
        return res.send(_.pick(result, ['_id', 'firstname', 'lastname', 'username', 'email']));
        
    }
    res.status(403).send({err: "Token not valid"});
}



module.exports = { loginUser }