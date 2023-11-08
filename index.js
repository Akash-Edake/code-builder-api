require("./src/db/mongoose");
const express = require("express");
const User = require("./src/model/user");

const port = process.env.PORT || 8089;

const app = express();
app.use(express.json());
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
    const user = await User.findOne({ _id: id });
    if (theme === "light" || theme === "dark") {
      let updateTheme = await User.findOneAndUpdate(
        { _id: id },
        { $set: { theme } }
      );
      res.status(201).send({ theme });
    }
    res.status(200).send({ theme: user.theme });
  } catch (e) {
    res.status(400).send(e);
  }
});
