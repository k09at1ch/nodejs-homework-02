const service = require("../service");
const Joi = require('joi');

const get = async (req, res, next) => {
  try {
    const results = await service.getAllcontacts();
    res.status(200).json({ contacts: results });
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
      res.status(200).json({ contacts: result });
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};
const createContactSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  name: Joi.string().required(),
});
const updateContactSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  name: Joi.string().required(),
});

const create = async (req, res, next) => {
  const { email, phone, name } = req.body;

  if (!email || !phone || !name) {
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");
    if (!name) missingFields.push("name");

    return res.status(400).json({
      status: "error",
      code: 400,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const result = await service.createContact({ email, phone, name });

    res.status(201).json({
      contact: result,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { email, phone, name } = req.body;

  const missingFields = [];

  if (!email) missingFields.push("email");
  if (!phone) missingFields.push("phone");
  if (!name) missingFields.push("name");

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const result = await service.updateContact(id, { email, phone, name });
    if (result) {
      res.status(200).json({
        contact: result,
      });
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

const updateStatus = async (req, res, next) => {
  const { id } = req.params;
  const { favorite = false } = req.body;
  if (!favorite) {
    res.status(400).json({ message: "missing field favorite" });
  }
  try {
    const result = await service.updateContact(id, { favorite });
    if (result) {
      res.status(200).json({
        contact: result,
      });
    } else {
      res.status(404).json({
        message:  "Not Found"
      });
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
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${id}`,
        data: "Not Found",
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
