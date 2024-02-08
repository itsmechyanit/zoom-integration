const express = require("express");
const { generateToken, generateMeeting } = require("./handler");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(`${__dirname}/form.html`);
});

router.post("/generate-meeting", generateToken, generateMeeting);

module.exports = router;
