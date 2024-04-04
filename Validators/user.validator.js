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
        name: joi.string().min(3).max(50).allow(''),
        email: joi.string().email().allow(''),
        password: joi.string().min(8).max(1024).allow(''),
        address: joi.string().min(5).max(250).allow(''),
        phoneNumber: joi.string().max(11).pattern(/^(012|010|011)\d{8}$/).allow('')
    })

    return schema.validate(user);   

}

module.exports = {
    validateNewUser,
    validateUpdateUser
}