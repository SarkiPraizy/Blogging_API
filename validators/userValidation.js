const joi = require("joi");
joiObjectId = require("joi-objectid")(joi);

const userValidatorMiddleWear = async (req, res, next) => {
  try {
    userValidator.validateAsync(req.user);
    next();
  } catch (error) {
    res.status(406).send(error.details[0].message);
  }
};

const userValidator = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  first_name: joi.string().min(2).required(),
  last_name: joi.string().min(2).required(),
  password: joi.string().min(2).trim().required(),
  confirmPassword: joi.ref("password"),
});

module.exports = userValidatorMiddleWear;
