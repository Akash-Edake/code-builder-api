require("./src/db/mongoose");
const cluster = require("cluster");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./src/routers/user");
const codeRouter = require("./src/routers/code");

const numCPUs = require("node:os").availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const port = process.env.PORT || 8080;

  // app.use((req,res,next)=>{
  //     res.status(503).send("server under maintenance")
  // })
  const app = express();
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(cors());
  app.use(userRouter);
  app.use(codeRouter);

  app.get("/load_balancing", (req, res) => {
    res.send({ msg: `Load Balancer Port No. ${process.pid}` });
  });

  app.listen(port, () => console.log("local connected"));
}
