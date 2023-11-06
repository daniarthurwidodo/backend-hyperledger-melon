const randomInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const send = async function () {
  const date = new Date("2015-03-25T12:00:00Z");
  const maxSize = 1;

  for (let index = 0; index < maxSize; index++) {
    let randomNumber = randomInterval(0, 1);
    let randomSuhu = randomInterval(17, 35)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({});

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `localhost:4001/anomali/tambah/?suhu=${randomSuhu}&status=${randomNumber}&tanggal=2023-11-09`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }
};

send();
