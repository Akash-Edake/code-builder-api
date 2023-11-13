const express = require("express");
const router = express.Router();
const Code = require("../model/code");
router.get("/code", async (req, res) => {
  try {
    const getCode = await Code.find({});
    res.status(200).send(getCode);
  } catch (error) {
    res.status(400).send("somethin went wrong");
  }
});

router.post("/code", async (req, res) => {
  const data = new Code(req.body);
  try {
    await data.save();
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
