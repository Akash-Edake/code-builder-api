require("./src/db/mongoose");
const express = require("express");
const cors = require("cors");
const User = require("./src/model/user");

const port = process.env.PORT || 8089;

const app = express();
app.use(express.json());
app.use(cors());
app.listen(port, () => console.log("local connected"));

app.get("/getusers", async (req, res) => {
  const getUser = await User.find({});
  try {
    return res.status(200).send(getUser);
  } catch (err) {
    return res.status(400).send(err);
  }
});

app.post("/user/singup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let userLogin = await User.findByCredentials(email, password);
    res.send(userLogin);
  } catch (error) {
    return res.status(401).send(error);
  }
});

app.post("/user/theme", async (req, res) => {
  const { id, theme } = req.body;

  try {
    if (!theme) {
      const user = await User.findOne({ _id: id });
      res.status(200).send({ theme: user.theme });
      return;
    }

    res.status(201).send({ theme });
    await User.findOneAndUpdate({ _id: id }, { $set: { theme } });
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/user/profilePic", async (req, res) => {
  const { id, profilePic } = req.body;
  try {
    if (!profilePic) {
      const user = await User.findOne({ _id: id });
      res.status(200).send({ profilePic: user.profilePic });
      return;
    }
    res.status(201).send({ profilePic });
    await User.updateOne({ _id: id }, { $set: { profilePic } });
  } catch (e) {
    res.status(400).send(e);
  }
});
