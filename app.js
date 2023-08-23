const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const Joi = require("joi");
const contactsRouter = express.Router();

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

contactsRouter.get("/api/contacts", (req, res) => {
  const contacts = listContacts();
  res.status(200).json(contacts);
});

contactsRouter.get("/api/contacts/:id", (req, res) => {
  const { id } = req.params;
  const contact = getById(id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

contactsRouter.post("/api/contacts", (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const newContact = addContact(req.body);
  res.status(201).json(newContact);
});

contactsRouter.delete("/api/contacts/:id", (req, res) => {
  const { id } = req.params;
  const result = removeContact(id);

  if (result) {
    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

contactsRouter.put("/api/contacts/:id", (req, res) => {
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

app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
