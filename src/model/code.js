const mongoose = require("mongoose");
const validator = require("validator");

const codeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for the code"],
  },
  content: {
    type: String,
    required: [true, "Please provide some content for your code"],
  },

  fileType: {
    type: String,
    required: [true, "please select a language"],
  },
  email: {
    type: String,
    required: [true, "please enter an email"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  comments: [
    {
      userName: {
        type: String,
      },
      text: {
        type: String,
        default: "",
      },
      date: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});
codeSchema.pre("save", async function (next) {
  this.comments = this.comments.concat({ userName: this.email });
  next();
});
const Code = mongoose.model("code", codeSchema);

module.exports = Code;
