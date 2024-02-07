const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const todoRouter = require("./routes/todos");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 4000;

// app configs.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());
app.use("/fetch", todoRouter);

//initialize the app.
async function initialize() {
  app.listen(PORT);
}

initialize().finally(() => console.log(`app started on port:${PORT}`));
