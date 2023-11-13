require("./src/db/mongoose");
const express = require("express");
const cors = require("cors");
const userRouter = require("./src/routers/user");

const port = process.env.PORT || 8080;

const app = express();

// app.use((req,res,next)=>{
//     res.status(503).send("server under maintenance")
// })
app.use(express.json());
app.use(cors());
app.use(userRouter);
app.listen(port, () => console.log("local connected"));
