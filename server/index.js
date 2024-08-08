const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/validate-attendance", (req, res) => {
  const { latitude, longitude, pin, voiceTranscript } = req.body;
  // Validate location, pin, and voice here
  res.send({ success: true });
});

app.listen(3001, () => console.log("Server running on port 3001"));
