const joi = require("joi");

let PaymentValidation = (Payment) => {
  Paymentschema = joi.object({
    NameOnVisa:joi.string().min(3).max(100).required(),
    Cvv:joi.number().integer().min(100).max(999).required(),
    VisaCardNumber: joi.number().integer().min(1000000000000000).max(9999999999999999).required(),
  });

  return Paymentschema.validate(Payment);
};

module.exports = {
  PaymentValidation,
};