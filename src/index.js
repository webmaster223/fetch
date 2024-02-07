const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const https = require("https"); // Import the https module
const fs = require("fs"); // Import the fs module to read files
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 4000;

const todoRouter = require("./routes/todos");

const sslOptions = {
  ca: fs.readFileSync(process.env.SSL_CA_PATH),
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
};
// app configs.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());
app.use("/fetch", todoRouter);

//initialize the app.
// Initialize the app with HTTPS
async function initialize() {
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
  });
}

initialize().finally(() => console.log(`App started on port: ${PORT}`));
