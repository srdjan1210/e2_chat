const { findUserById } = require('../models/user');
const _ = require('lodash');

userinfo = async (req, res) => {
    if(!req.payload)
        return res.status(403).send({err: "Token not valid"});
    const user = await findUserById({_id: req.payload._id});
    if(user == null)
        return res.status(204).send({ err: "User not found"});
    return res.status(200).send(_.pick(user, ['_id', 'firstname', 'lastname', 'username', 'email', 'profile_image']))
    
}



module.exports = { userinfo }
