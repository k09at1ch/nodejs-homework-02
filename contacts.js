const express = require("express");
const contactsRouter = express.Router();
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

contactsRouter.get("/", (req, res) => {
  const contacts = listContacts();
  res.status(200).json(contacts);
});

contactsRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const contact = getById(id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

contactsRouter.post("/", (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const newContact = addContact(req.body);
  res.status(201).json(newContact);
});

contactsRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const result = removeContact(id);

  if (result) {
    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

contactsRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const updatedContact = updateContact(id, req.body);
  if (updatedContact) {
    res.status(200).json(updatedContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = contactsRouter;
