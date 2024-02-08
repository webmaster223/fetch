const express = require("express");
const fs = require("fs");
const https = require("https");
const dotenv = require("dotenv");
const axios = require("axios");
const app = express();
const ipaddr = require("ipaddr.js");
dotenv.config();
const PORT = process.env.PORT || 3006;
const SSL_CA_PATH = process.env.SSL_CA_PATH;
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;
const ASTERNIC_API_USERNAME = process.env.ASTERNIC_API_USERNAME;
const ASTERNIC_API_PASSWORD = process.env.ASTERNIC_API_PASSWORD;
// Define a list of whitelisted IPs (could also be loaded from .env or an external source)
const WHITELISTED_IPS = [
  "200.110.171.185", // Example IP, replace with actual whitelisted IPs
  "127.0.0.1", // Allow localhost for testing purposes
];
// Middleware to normalize and check if the IP is whitelisted
app.use((req, res, next) => {
  let clientIp =
    req.headers["x-forwarded-for"] || req.ip || req.connection.remoteAddress;
  // Normalize the IP address using ipaddr.js
  try {
    const addr = ipaddr.parse(clientIp);
    if (addr.kind() === "ipv6" && addr.isIPv4MappedAddress()) {
      clientIp = addr.toIPv4Address().toString();
    }
  } catch (e) {
    console.error(`Error parsing IP address: ${clientIp}`, e);
    return res.status(400).send("Invalid IP address format.");
  }
  if (WHITELISTED_IPS.includes(clientIp)) {
    next();
  } else {
    res
      .status(403)
      .send(`Access denied: Your IP (${clientIp}) is not on the whitelist.`);
  }
});
// Middleware to handle forwarding requests
app.use("/api/*", async (req, res) => {
  const apiUrl = `https://vault.ultimatevoip.net/stats/rest/index.php${req.originalUrl.slice(
    4
  )}`;
  try {
    const response = await axios.get(apiUrl, {
      auth: {
        username: ASTERNIC_API_USERNAME,
        password: ASTERNIC_API_PASSWORD,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error forwarding request:", error);
    res.status(500).send("Error processing your request");
  }
});
// Initialize HTTPS server with SSL certificates
https
  .createServer(
    {
      key: fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH),
      ca: fs.readFileSync(SSL_CA_PATH),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
