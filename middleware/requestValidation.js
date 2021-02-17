
const loginValidation = (req, res, next) => {
    if( !req.headers['x-auth'] && !req.body.username && !req.body.password )
        return res.status(422).send({err: 'Valid data not provided!'});
    next();
}

const registerValidation = (req, res, next) => {
    if( !req.body.username || !req.body.email || !req.body.password || !req.file )
        return res.status(422).send({err: 'Could not register, invalid data '});
    next();
}

module.exports = { loginValidation, registerValidation } 