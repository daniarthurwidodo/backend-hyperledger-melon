const { curly } = require("node-libcurl");

const randomInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const send = async function () {
  const date = new Date("2015-03-25T12:00:00Z");
  const maxSize = 9;

  for (let index = 0; index < maxSize; index++) {
    const random = randomInterval(2, 5);
    const element = { date: date };
    console.log(element, index, random);
  }

  const { statusCode, data, headers } = await curly.get(
    "https://jsonplaceholder.typicode.com/todos/1"
  );
  console.log(statusCode, data);
};

send();
