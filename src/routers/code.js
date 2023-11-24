const express = require("express");
const router = express.Router();
const { getCode, postCode } = require("../controllers/code");

router.get("/code", getCode);

router.post("/code", postCode);

module.exports = router;
