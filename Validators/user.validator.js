const joi = require('joi');

const validateNewUser = (user) => {
    const schema = joi.object({
        name: joi.string().min(3).max(50).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).max(1024).required()
    })

    return schema.validate(user, {abortEarly: false})
}

const validateUpdateUser = (user) => {
    const schema = joi.object({
        name: joi.string().min(3).max(50),
        email: joi.string().email(),
        password: joi.string().min(8).max(1024)
    })

    return schema.validate(user);   

}

module.exports = {
    validateNewUser,
    validateUpdateUser
}