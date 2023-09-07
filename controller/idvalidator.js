const Joi = require("joi");

const idSchema = Joi.string().hex().required().messages({
  'any.required': 'Missing required ID field',
  'string.hex': 'Invalid ID format',
});

const validateId = (req, res, next) => {
  const { id } = req.params;
  const validationResult = idSchema.validate(id);

  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.details[0].message });
  }

  next();
};

module.exports = validateId;
