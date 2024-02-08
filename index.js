const express = require("express");
const dotenv = require("dotenv");

const router = require("./routes");

dotenv.config({ path: `${__dirname}/config.env` });

const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", router);

app.listen(3000);
