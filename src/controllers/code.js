const Code = require("../model/code");

exports.getCode = async (req, res) => {
  try {
    const getCode = await Code.find({});
    res.status(200).send(getCode);
  } catch (error) {
    res.status(400).send("somethin went wrong");
  }
};

exports.postCode = async (req, res) => {
  const data = new Code(req.body);
  try {
    await data.save();
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
};
