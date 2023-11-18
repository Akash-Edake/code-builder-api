require("./src/db/mongoose");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./src/routers/user");
const codeRouter = require("./src/routers/code");


const port = process.env.PORT

const app = express();

// app.use((req,res,next)=>{
//     res.status(503).send("server under maintenance")
// })
app.use(express.json());
app.use(morgan('dev'))
app.use(cors());
app.use(userRouter);
app.use(codeRouter);
app.listen(port, () => console.log("local connected"));
