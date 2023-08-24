const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs/promises');

const newId = uuidv4();

const contactsRouter = express.Router();
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(morgan(formatsLogger));
app.use(cors());
app.use(express.json());


let contacts = [];
fs.readFile('contacts.json', 'utf8')
  .then((data) => {
    contacts = JSON.parse(data);
  })
  .catch((err) => {
    console.error('Error reading contacts file:', err);
  });

contactsRouter.get("/", (req, res, next) => {
  res.status(200).json(contacts);
});

contactsRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const contact = contacts.find((el) => el.id === id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
});

contactsRouter.post("/", (req, res, next) => {
  const { name, phone, email } = req.body;
  const contact = {
    name,
    phone,
    email,
    id: uuidv4(),
  };

  contacts.push(contact);

  fs.writeFile('contacts.json', JSON.stringify(contacts, null, 2), 'utf8')
    .then(() => {
      res.status(200).json(contact);
    })
    .catch((err) => {
      console.error('Error writing to contacts file:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

contactsRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = contacts.findIndex((el) => el.id === id);
  if (index !== -1) {
    contacts.splice(index, 1);

    fs.writeFile('contacts.json', JSON.stringify(contacts, null, 2), 'utf8')
      .then(() => {
        res.status(204).json();
      })
      .catch((err) => {
        console.error('Error writing to contacts file:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
});

contactsRouter.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const { phone, name, email } = req.body;
  const index = contacts.findIndex((el) => el.id === id);

  if (index !== -1) {
    contacts[index].phone = phone;
    contacts[index].name = name;
    contacts[index].email = email;
    fs.writeFile('contacts.json', JSON.stringify(contacts, null, 2), 'utf8')
      .then(() => {
        res.status(200).json(contacts[index]);
      })
      .catch((err) => {
        console.error('Error writing to contacts file:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  } else {
    res.status(404).json({ message: 'Contact not found' });
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
