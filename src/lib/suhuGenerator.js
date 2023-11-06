const { Curl } = require("node-libcurl");
const querystring = require("querystring");
const dayjs = require("dayjs");
const moment = require("moment");

const randomInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const send = async function () {
  const maxSize = 24;
  const startdate = new Date("2023-11-09");
  for (let index = 0; index < maxSize; index++) {
    let date = moment(startdate)
      .add(index + 1, "hours")
      .toISOString();
    const random = randomInterval(17, 25);
    const element = { date: date, suhu: random };
  }

};

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://103.23.199.113:4001/transaksi/tambah/TERTUNDA", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

send();
