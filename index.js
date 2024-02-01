const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { log } = require("mercedlogger");
const { readFile } = require("fs/promises");

const userController = require("./src/user/user.controller");
const monitorController = require("./src/monitor/monitor.controller");
const melonController = require("./src/melon/melon.controller");
const transaksiController = require("./src/transaksi/transaksi.controller");
const anomaliController = require("./src/anomali/anomali.controller");
const webController = require("./src/web/web.controller");

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
app.use("/web", webController);

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

app.listen(PORT, () => {
  log.green("SERVER STATUS", `server is running at port ${PORT}`);
});


const https = require("https"),
 fs = require("fs");

const options = {
  key: fs.readFileSync("/etc/ssl/private/apache-selfsigned.key"),
  cert: fs.readFileSync("/etc/ssl/certs/apache-selfsigned.crt")
};
https.createServer(options, app).listen(8082);
