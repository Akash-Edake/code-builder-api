const express = require("express");
const User = require("../model/user");
const auth = require("../middleware/auth")

const router = express.Router();

router.get("/getusers", async (req, res) => {
  const getUser = await User.find({});
  try {
    return res.status(200).send(getUser);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.post("/user/auth",auth,(req,res)=>{
 res.status(200).send(req.user)
})

router.post("/user/logout",auth,(req,res)=>{
 try{
  req.user.tokens=[]
  req.user.save()
  res.status(200).send("log out successfully")
 }catch(e){

 }
 })

router.post("/user/singup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = user.generateJwtToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let userLogin = await User.findByCredentials(email, password);
    const token = userLogin.generateJwtToken();
    res.send({ userLogin, token });
    userLogin.visiting = userLogin.visiting.concat(new Date());
  } catch (error) {
    return res.status(401).send(error);
  }
});

router.post("/user/theme", async (req, res) => {
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

router.post("/user/snippetsTheme", async (req, res) => {
  const { id, theme, snippetsTheme } = req.body;
  try {
    let data1 = await User.updateMany({}, { $set: { masterControl: true } });
    console.log(data1.modifiedCount);
    if (!theme || !snippetsTheme) {
      const user = await User.findOne({ _id: id });
      res.status(200).send({ theme: user.snippetsTheme });
      return;
    }

    res.status(201).send({ theme, snippetsTheme });

    //! theme = light || dark , snippetsTheme is user defind
    const updateQuery = { $set: { [`snippetsTheme.${theme}`]: snippetsTheme } };
    await User.findOneAndUpdate({ _id: id }, updateQuery);

    //! object injection
    // await User.updateMany({}, { $set: { snippetsTheme: {light:"a11yLight",dark:"dracula"} } });
  } catch (e) {
    res.status(400).send(e);
  }
});
router.post("/user/profilePic", async (req, res) => {
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

module.exports = router;
