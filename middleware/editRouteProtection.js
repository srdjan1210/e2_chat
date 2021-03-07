const _ = require('lodash')

const checkForEmptyString = (req, res, next) => {
    const parameter = req.params.propname;
    if(req.body[parameter].trim() == "") return res.status(400).send({ err: 'Given property empty!'});
    next();
}

const checkIfParameterExists = (req, res, next) => {
    const parameter = req.params.propname;
    if(!req.body[parameter]) return res.status(400).send({ err: 'Property not provided'});
    next();
}

const checkForInvalidProperty = (req, res, next) => {
    const parameter = req.params.propname;
    const properties = ['city', 'state_province', 'country', 'lastname', 'firstname', 'birthday', 'biography', 'nationality', 'street_adress'];
    for(let property of properties) 
        if(property == parameter) return next();
    return res.status(404).send({ err: 'Bad route!'});

    
}

const checkIfPasswordDataExists = (req, res, next) => {
    const { password, new_password } = _.pick(req.body, ['password', 'new_password']);
    if(!password || !new_password) return res.status(400).send({ err: 'Data missing!'});
    next();
}

const checkIfUsernameExists = (req, res, next) => {
    const username = req.body.username;
    if(!username) return res.status(400).send({err: 'Username missing'});
    next();
}
const checkIfEmailExists = (req, res, next) => {
    const email = req.body.email;
    if(!email) return res.status(400).send({err: 'Email missing'});
    next();
}

module.exports = { checkForEmptyString, checkIfParameterExists, checkForInvalidProperty, checkIfPasswordDataExists }