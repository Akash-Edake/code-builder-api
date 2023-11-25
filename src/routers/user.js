const express = require("express");
const auth = require("../middleware/auth");
const {
  getusers,
  singup,
  login,
  theme,
  snippetsTheme,
  profilePic,
  muitheme,
  logout,
  userIsAuthenticated,
  weather,
} = require("../controllers/user");

const router = express.Router();

router.get("/getusers", getusers);

router.post("/user/auth", auth, userIsAuthenticated);

router.post("/user/logout", auth, logout);

router.post("/user/singup", singup);

router.post("/user/login", login);

router.post("/user/theme", theme);

router.post("/user/muitheme", muitheme);

router.post("/user/snippetsTheme", snippetsTheme);

router.post("/user/profilePic", profilePic);

router.get("/weather", weather);

module.exports = router;
