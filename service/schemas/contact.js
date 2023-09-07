const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contact = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false
    },
    phone:{
        type: String,
    }
  },
//   { versionKey: false, timestamps: true }
);

const Contact = mongoose.model("contact", contact);

module.exports = Contact;