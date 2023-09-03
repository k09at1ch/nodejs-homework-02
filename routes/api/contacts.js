const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs/promises");
const Joi = require('joi');

const contactsFile = "contacts.json";

async function readContactsFromFile() {
  try {
    const data = await fs.readFile(contactsFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading contacts file:", err);
    return [];
  }
}

async function writeContactsToFile(contacts) {
  try {
    await fs.writeFile(contactsFile, JSON.stringify(contacts, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to contacts file:", err);
  }
}

router.get("/", async (req, res, next) => {
  const contacts = await readContactsFromFile();
  res.status(200).json(contacts);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const contacts = await readContactsFromFile();
  const contact = contacts.find((el) => el.id === id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});




const schema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
});




router.post("/", async (req, res) => {
  const { error } = schema.validate(req.body);


  const { name, phone, email } = req.body;
  console.log(req.body);

  const contacts = await readContactsFromFile();
  if(!phone && !name&& !email) {
    return res.status(400).json({message: "missing fields"})
  }
  if (!phone) {
    return res.status(400).json({ message: `Missing required phone field` });
  }
  if (!name) {
    return res.status(400).json({ message: `Missing required name field` });
  }
  if (!email) {
    return res.status(400).json({ message: `Missing required email field` });
  }

  const contact = {
    name,
    phone,
    email,
    id: uuidv4(),
  };
  contacts.push(contact);

  await writeContactsToFile(contacts);

  res.status(201).json(contact);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const contacts = await readContactsFromFile();
  const index = contacts.findIndex((el) => el.id === id);

  if (index !== -1) {
    contacts.splice(index, 1);

    await writeContactsToFile(contacts);

    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { phone, name, email } = req.body;

  if(!phone && !name&& !email) {
    return res.status(400).json({message: "missing fields"})
  }
  if (!phone) {
    return res.status(400).json({ message: `Missing required phone field` });
  }
  if (!name) {
    return res.status(400).json({ message: `Missing required name field` });
  }
  if (!email) {
    return res.status(400).json({ message: `Missing required email field` });
  }

  const contacts = await readContactsFromFile();
  const index = contacts.findIndex((el) => el.id === id);

  if (index !== -1) {
    const schema = Joi.object({
      phone: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ");
      return res.status(400).json({ message: `Validation error: ${errorMessage}` });
    }

    contacts[index].phone = phone;
    contacts[index].name = name;
    contacts[index].email = email;

    await writeContactsToFile(contacts);

    res.status(200).json(contacts[index]);
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});


module.exports = router;

