const User = require("../model/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("token");
    if (!token){
        return res
        .status(401)
        .send({ auth: false, message: "No token provided" });
    }

    let decoded = jwt.verify(token, "solt code");
    let user = await User.findOne({ _id: decoded._id, "tokens.token": token });
    if (!user) {
      return res.status(401).send({ auth: false, message: "User not found!" });
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ msg: "Token is not valid" });
  }
};

module.exports = auth;