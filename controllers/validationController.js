const Joi = require('joi');

const validateUserData = (user) => {
    let schema = Joi.object({
        username: Joi.string().max(15).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8)
    });
    return schema.validate(user);
}


const validateEmail = (email) => {
    let schema = Joi.object({ email: Joi.string().email().required() });
    return schema.validate({ email });
}

const validatePassword = (password) => {
    let schema = Joi.object({ password: Joi.string().min(8) });
    return schema.validate({ password });
}

module.exports = { validateUserData, validateEmail, validatePassword }
