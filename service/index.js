const Contact = require("./schemas/contact");

const getAllcontacts = async () => {
  return Contact.find();
};

const getContactById = (id) => {
  return Contact.findOne({ _id: id });
};

const createContact = ({ email, phone, name }) => {
  return Contact.create({ email, phone, name });
};

const updateContact = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const removeContact = (id) => {
  return Contact.findByIdAndRemove({ _id: id });
};

module.exports = {
  getAllcontacts,
  getContactById,
  updateContact,
  removeContact,
  createContact,
};
