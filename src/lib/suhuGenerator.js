const randomInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const  addHours = (date, hours) => {
  // date.setTime(date.getTime() + hours * 60 * 60 * 1000);

  return date;
}

// ✅ Add 1 hour to the current date
// const result1 = addHours(new Date(), 1);
// console.log(result1); // 👉️ 2023-07-26T07:23:49.670Z

// // ✅ Add 2 hours to a different date
// const date = new Date('2024-03-14T18:30:05.000Z');

// const result2 = addHours(date, 2);
// console.log(result2); // 👉️ 2024-03-14T20:30:05.000Z

const perHour = 24;
const startdate = new Date("2023-11-04");

const send = async function () {


  for (let index = 0; index < perHour; index++) {
    const randomSuhu = randomInterval(17, 34);
    const randomStatus = randomInterval(0, 1);
    // const tanggal = addHours(startdate, 1)
    let tanggal = new Date("2023-11-02").setHours(index)
    let tanggalISO = new Date(tanggal).toISOString()
    // const element = { date: date, suhu: random };
    console.log(tanggal, randomSuhu, tanggalISO);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    var raw = JSON.stringify({});
  
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    fetch(`http://localhost:4001/monitor/tambah?suhu=${randomSuhu}&deviceID=001&status=1&tanggal=${tanggalISO}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }


};

send();
