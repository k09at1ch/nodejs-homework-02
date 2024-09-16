const service = require("../service");
const Joi = require("joi");
const mongoose = require("mongoose");

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

const contactSchemaStatus = Joi.object({
  favorite: Joi.boolean().required().messages({
    'any.required': 'missing required favorite field',
  }),
});

const get = async (req, res, next) => {
  try {
    const results = await service.getAllcontacts();
    res.status(200).json(results);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Not found" });
  }

  try {
    const result = await service.getContactById(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

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

    res.status(201).json(result);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { email, phone, name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Not found" });
  }
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
        message: "not found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateStatus = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;
 
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Not found" });
  }
  if (favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  const validationResult = contactSchemaStatus.validate({ favorite });

  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.details[0].message });
  }

  try {
    if (favorite !== undefined) {
      const updatedContact = await service.updateContact(id, { favorite });
      if (updatedContact) {
        res.status(200).json(updatedContact);
      } else {
        res.status(404).json({ message: "not found" });
      }
    } else {
      res.status(200).json({ message: "No changes made" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;
 
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Not found" });
  }
  try {
    const result = await service.removeContact(id);
    if (result) {
      res.status(200).json({message: "contact deleted"});
    } else {
      res.status(404).json({
        message: "not found"
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
