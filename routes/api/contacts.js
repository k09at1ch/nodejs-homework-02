const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs/promises");

const newId = uuidv4();

let contacts = [];
fs.readFile("contacts.json", "utf8")
  .then((data) => {
    contacts = JSON.parse(data);
  })
  .catch((err) => {
    console.error("Error reading contacts file:", err);
  });

router.get("/", (req, res, next) => {
  res.status(200).json(contacts);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const contact = contacts.find((el) => el.id === id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

router.post("/", (req, res) => {
  const { name, phone, email } = req.body;
  console.log(req.body);

  if (name === undefined || phone === undefined || email === undefined) {
    console.log("Invalid input");
    return res.status(400).json({ message: "Invalid input" });
  }

  const contact = {
    name,
    phone,
    email,
    id: uuidv4(),
  };
  contacts.push(contact);
  console.table(contacts);

  fs.writeFile(
    "contacts.json",
    JSON.stringify(contacts, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing to contacts file:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.status(200).json(contact);
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = contacts.findIndex((el) => el.id === id);
  if (index !== -1) {
    contacts.splice(index, 1);

    fs.writeFile("contacts.json", JSON.stringify(contacts, null, 2), "utf8")
      .then(() => {
        res.status(204).json();
      })
      .catch((err) => {
        console.error("Error writing to contacts file:", err);
        res.status(500).json({ message: "Internal Server Error" });
      });
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

router.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const { phone, name, email } = req.body;
  const index = contacts.findIndex((el) => el.id === id);

  if (index !== -1) {
    contacts[index].phone = phone;
    contacts[index].name = name;
    contacts[index].email = email;
    fs.writeFile("contacts.json", JSON.stringify(contacts, null, 2), "utf8")
      .then(() => {
        res.status(200).json(contacts[index]);
      })
      .catch((err) => {
        console.error("Error writing to contacts file:", err);
        res.status(500).json({ message: "Internal Server Error" });
      });
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

module.exports = router;
