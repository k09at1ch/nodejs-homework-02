const service = require("../service");
const Joi = require("joi");

const get = async (req, res, next) => {
  try {
    const results = await service.getAllcontacts();
    res.status(200).json(results); // Оновлено відповідь, щоб повертати масив об'єктів контактів
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await service.getContactById(id);
    if (result) {
      res.status(200).json(result); // Оновлено відповідь, щоб повертати просто об'єкт контакту
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const contactSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'missing required email field',
    'string.email': 'email is invalid',
  }),
  phone: Joi.string().required().messages({
    'any.required': 'missing required phone field',
  }),
  name: Joi.string().required().messages({
    'any.required': 'missing required name field',
  }),
});

const create = async (req, res, next) => {
  const { email, phone, name } = req.body;
  if (!phone && !name && !email) {
    return res.status(400).json({ message: "missing fields" });
  }
  const validationResult = contactSchema.validate({ email, phone, name });

  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.details[0].message });
  }

  try {
    const result = await service.createContact({ email, phone, name });

    res.status(201).json(result); // Оновлено відповідь, щоб повертати просто об'єкт контакту
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { email, phone, name } = req.body;
  if (!phone && !name && !email) {
    return res.status(400).json({ message: "missing fields" });
  }
  const validationResult = contactSchema.validate({ email, phone, name });

  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.details[0].message });
  }

  try {
    const result = await service.updateContact(id, { email, phone, name });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({
        message: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const contactSchemaStatus = Joi.object({
  favorite: Joi.boolean().required().messages({
    'any.required': 'missing field favorite',
    'boolean.base': 'favorite must be a boolean',
  }),
});

const updateStatus = async (req, res, next) => {
  const { id } = req.params;
  const { favorite = false } = req.body;
  
  if (favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  
  const validationResult = contactSchemaStatus.validate({ favorite });

  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.details[0].message });
  }

  try {
    const updatedContact = await service.updateContact(id, { favorite });
   
    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await service.removeContact(id);
    if (result) {
      res.status(200).json(
        result 
      );
    } else {
      res.status(404).json({
        message: "Not Found"
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  updateStatus,
  remove,
};
