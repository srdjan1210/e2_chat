const { findUserById, findChatUsers } = require('../models/user');
const { findOrCreateChatRoom } = require('../models/chatRoom');
const { loadMessages} = require('../models/message');
const _ = require('lodash');

userinfo = async (req, res) => {
    if(!req.payload)
        return res.status(403).send({err: "Token not valid"});
    const user = await findUserById({_id: req.payload._id});
    if(user == null)
        return res.status(204).send({ err: "User not found"});
    return res.status(200).send(_.pick(user, ['_id', 'firstname', 'lastname', 'username', 'email',
                                              'birthday', 'nationality', 'street_adress', 'province_state',
                                              'country', 'city', 'biography', 'profile_img_100', 'profile_img_300']))
    
}

chatsinfo = async (req, res) => {
    if(!req.payload)
        return res.status(403).send({err: "Token not valid"});
    const users = await findChatUsers(req.payload._id);
    return res.status(200).send({data: users});

}




module.exports = { userinfo, chatsinfo }
