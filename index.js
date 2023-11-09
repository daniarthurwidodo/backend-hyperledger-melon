const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { log } = require("mercedlogger");
const { readFile } = require("fs/promises");
const fs = require("fs");

const https = require("https");

const userController = require("./src/user/user.controller");
const monitorController = require("./src/monitor/monitor.controller");
const melonController = require("./src/melon/melon.controller");
const transaksiController = require("./src/transaksi/transaksi.controller");
const anomaliController = require("./src/anomali/anomali.controller");

const path = require("path");

const config = require("./config.json");

const PORT = 4001;
// global middleware
const app = express();
app.use(cors()); // add cors headers
app.use(express.json());
app.use("/user", userController);
app.use("/monitor", monitorController);
app.use("/melon", melonController);
app.use("/transaksi", transaksiController);
app.use("/anomali", anomaliController);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log(__dirname);
app.get("/", (req, res) => {
  res.send("hi mom");
});

// db connection
mongoose.connect(config.mongodb_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", () => log.red("ERROR CONNECTION", "connection error:"));
db.once("open", () => log.green("DATABASE STATUS", `Connected to mongo `));

var key = fs.readFileSync(__dirname + "/certs/selfsigned.key");
var cert = fs.readFileSync(__dirname + "/certs/selfsigned.crt");
var options = {
  rejectUnauthorized: false,
  key: key,
  cert: cert,
};
var server = https.createServer(options, app);

server.listen(PORT, () => {
  log.green("SERVER STATUS", `server is running at port ${PORT}`);
});
