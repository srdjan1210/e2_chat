const Joi = require('joi');

const validateUserData = (user) => {
    let schema = Joi.object({
        username: Joi.string().max(15).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8)
    });
    return schema.validate(user);
}

module.exports = { validateUserData }
