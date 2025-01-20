// Import the required modules
const express = require("express");
const bodyParser = require("body-parser"); // For parsing JSON request bodies
const axios = require('axios');
const FormData = require("form-data");
const cors = require("cors");


// Initialize the app
const app = express();
const errorweb = process.env.errorwebhook

// Middleware for parsing JSON
app.use(bodyParser.json());
app.use(cors());

// Root route
app.get("/", (req, res) => {
  res.send("👋 sup mate");
});

// POST route example
app.post("/api", (req, res) => {
  const data = req.body; // Get JSON body data
  //console.log("Received POST request:", data);

  // Respond with a message
  //console.log(JSON.stringify(req.body.body))
  let config = {
    method: req.body.method,
    maxBodyLength: Infinity,
    url: req.body.url,
    headers: req.body.headers,
    data: JSON.stringify(req.body.body),
  };
 // console.log(config)
  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    logger(JSON.stringify(response.data), String(req.body.url), String(req.body.method))
       res.status(response.status).json({
    message: "request sent successfully!",
    receivedData: JSON.stringify(response.data),
  });
    })
    .catch((error) => {
     // console.log(error);
    console.log(error.response.data)
    reporterror(JSON.stringify(error.response.data), 'api', String(req.body.method))
     res.status(error.status).json(error.response.data);
    });
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
  res.status(404).send("Route not found.");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
function reporterror(error, func, method) {
  console.log(error, func, method)
  let data = {
    embeds: [
      {
        title: `error from ${func} -- ${method}`,
        description: `error: ${error}`,
        color: 15885126,
      },
    ],
  };
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: errorweb,
    headers: {
    },
    data: (data),
  };
  //console.log(errorweb)
  console.log(config)
  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error.response.data);
    });
}
function logger(error, func, method) {
  console.log(error, func)
  let data = {
    embeds: [
      {
        title: `${method} to ${func}`,
        description: `${error}`,
        color: 4649580,
      },
    ],
  };
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: errorweb,
    headers: {
    },
    data: data,
  };
  console.log(data)
  //console.log(errorweb)
  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error.response.data, error.response.status);
    });
}