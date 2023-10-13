const express = require('express');
const mongoose = require('mongoose');
const { log } = require("mercedlogger") 
const { readFile } = require('fs/promises')
const userController = require('./src/user/user.controller')
const monitorController = require('./src/monitor/monitor.controller')
const melonController = require('./src/melon/melon.controller') 

const config = require('./config.json')

const PORT = 4001
// global middleware
const app =  express()

app.use(express.json())
app.use("/user", userController)
app.use("/monitor", monitorController)
app.use("/melon", melonController)

app.get( '/', (req, res ) => {
    res.send('hi mom')
})

// db connection
mongoose.connect(config.mongodb_url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error',() => log.red("ERROR CONNECTION", 'connection error:'));
db.once('open', () => log.green("DATABASE STATUS", `Connected to mongo `));

app.listen(PORT, () => {
    log.green("SERVER STATUS", `server is running at port ${PORT}`)
})