const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", (req, res) => {
  async function fetchAsternicReport() {
    // Encode the Asternic API URL
    const asternicApiUrl =
      "https://vault.ultimatevoip.net/stats/rest/index.php?entity=reports&start=2024-01-01&end=2024-01-31";

    // Define your Basic Authentication credentials
    const username = "Scott";
    const password = "Scott@q1w2e3";

    // Base64 encode the credentials using Buffer
    const base64Credentials = Buffer.from(`${username}:${password}`).toString(
      "base64"
    );

    try {
      // Use axios to make the request with Basic Authentication
      const response = await axios.get(asternicApiUrl, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });

      // Log the response data
      console.log("Response:", response.data);
      return res.send(response.data);
    } catch (error) {
      // Log any errors
      console.error(
        "There has been a problem with your fetch operation:",
        error.message
      );
    }
  }

  // Call the function
  fetchAsternicReport();

  //   let todos = req.app.db.get("todos").value();

  //   return res.send(todos);
});

module.exports = router;
