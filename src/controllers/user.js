const User = require("../model/user");
const axios = require("axios");

exports.getusers = async (req, res) => {
  const getUser = await User.find({});
  try {
    return res.status(200).send(getUser);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.singup = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = user.generateJwtToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let userLogin = await User.findByCredentials(email, password);
    const token = userLogin.generateJwtToken();
    res.send({ userLogin, token });
    userLogin.visiting = userLogin.visiting.concat(new Date());
  } catch (error) {
    return res.status(401).send(error);
  }
};

exports.theme = async (req, res) => {
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
};

exports.snippetsTheme = async (req, res) => {
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
};

exports.profilePic = async (req, res) => {
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
};

exports.muitheme = async (req, res) => {
  const { id, muiTheme } = req.body;
  try {
    res.status(201).send({ muiTheme });
    await User.findOneAndUpdate({ _id: id }, { $set: { muiTheme } });
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.logout = (req, res) => {
  try {
    req.user.tokens = [];
    req.user.save();
    res.status(200).send("log out successfully");
  } catch (e) {}
};

exports.userIsAuthenticated = (req, res) => {
  res.status(200).send(req.user);
};

exports.weather = async (req, res) => {
  const { latitude, longitude, email } = req.body;
  try {
    const user = await User.findOne({ email });

    const currentWeather = await axios.get(
      `http://api.weatherstack.com/current?access_key=07540ffc77eb9695997ccfeb0a35662c&query=${
        latitude + "," + longitude
      }`
    );
    await User.findOneAndUpdate(
      { email },
      { $set: { locations: [...user.locations, currentWeather.data] } }
    );
    res.send(currentWeather.data);
  } catch (e) {
    res.send(e.massage);
  }
};
