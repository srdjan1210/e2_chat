const webtoken = require('../middleware/webtoken');
const { findUserByUsername, setUserActiveTime } = require('../models/user');
const _ = require('lodash');
const { verifyPassword } = require('../middleware/hash');

loginUser = async (req, res) => {
    const user = req.body;
    let result = await findUserByUsername(user);
    
    if(result == null) return res.status(401).send({ err: "Wrong username or password!"});

    if(!(await verifyPassword(user.password, result.password))) return res.status(401).send({err: "Password or username incorrect"});
    if(!req.payload){
        const token = webtoken.createToken(_.pick(result, '_id', 'username'));
        res.header('x-auth', token).status(200);
        await setUserActiveTime({username: result.username});
        return res.status(200).send(_.pick(result, ['_id', 'firstname', 'lastname', 'username', 'email',
                                                  'birthday', 'nationality', 'street_adress', 'province_state',
                                                  'country', 'city', 'biography', 'profile_img_100', 'profile_img_300']));  
    }
    res.status(403).send({err: "Token not valid"});
}



module.exports = { loginUser }