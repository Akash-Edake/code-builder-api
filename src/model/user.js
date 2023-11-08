const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    minlength: [3, "Name should be at least 3 characters long"],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be minimum of 8 characters"],
    select: true, // To hide the password field while fetching data from db
  },
  profilePic: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png ",
  },
  theme: {
    type: String,
    default: "light",
  },
  accontCreated: {
    type: String,
    default: new Date(),
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }
  const autheticated = await bcrypt.compare(password, user.password);
  if (!autheticated) {
    throw new Error("password is wrong");
  }
  return user;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
