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

    setInterval(() => {
      console.log(element);
    }, 2000);
  }

  sendCurl("https://reqres.in/api/users");
};

const sendCurl = (url) => {
  const curlTest = new Curl();
  const terminate = curlTest.close.bind(curlTest);

  // https://reqres.in/api/users"
  curlTest.setOpt(Curl.option.URL, url);
  curlTest.setOpt(Curl.option.POST, true);
  curlTest.setOpt(Curl.option.POSTFIELDS, querystring.stringify({}));

  curlTest.on("end", function (statusCode, data, headers) {
    console.info("Status code " + statusCode);
    console.info("***");
    console.info("Our response: " + data);
    console.info("***");
    console.info("Length: " + data.length);
    console.info("***");
    console.info("Total time taken: " + this.getInfo("TOTAL_TIME"));

    this.close();
  });
  curlTest.on("error", terminate);

  curlTest.perform();
};

send();
