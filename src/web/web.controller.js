const { Router } = require("express");
const userWebModel = require("../user/user.model");
const webBcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const webTransaksiModel = require("../transaksi/transaksi.model");

const webRouter = Router();

// register in web
webRouter.post("/user/register", async (req, res) => {
  try {
    const user = await userWebModel.findOne({ username: req.body.username });
    if (user) {
      console.log("user sudah registrasi");
      res.status(201).send({
        status: false,
        message: "user sudah pernah registrasi",
      });
      res.end();
    } else if (!user && req.body.role === "admin") {
      // hash the password
      req.body.password = await bcrypt.hash(req.body.password, 10);
      // create a new user
      await User.create(req.body);

      console.log("user berhasil ke database");
      res.status(200).send({
        status: true,
        message: req.body,
      });
      res.end();
    } else {
      res.status(401).send({
        status: false,
        message: "harap periksa data anda",
      });
      res.end();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      status: false,
      message: "harap periksa username / password",
      body: error.message,
    });
    res.end();
  }
});

webRouter.post("/user/login", async (req, res) => {
  try {
    const user = await userWebModel.findOne({ username: req.body.username });
    const result = await webBcrypt.compare(req.body.password, user.password);

    if (user && result && user.role === "admin") {
      res.status(200).send({ status: true, message: user });
      res.end();
    } else if (user && result && user.role !== "admin") {
      res.status(401).send({
        status: false,
        message: "anda bukan admin!",
      });
      res.end();
    } else if (!user && result == false) {
      res.status(401).send({
        status: false,
        message: "harap periksa username / password",
      });
      res.end();
    } else if (user && !result) {
      res.status(401).send({
        status: false,
        message: "harap periksa username / password",
      });
      res.end();
    } else {
      console.log(user);
      console.log(result);
      res.status(401).send({
        status: false,
        message: "harap periksa username / password",
      });
      res.end();
    }
  } catch (error) {
    res.status(401).send({
      status: false,
      message: "harap periksa username / password",
    });
    res.end();
  }
});

webRouter.get('/transaksi/masuk', async (req, res) => {
    const result = await webTransaksiModel.find({
        jenisTransaksi: "MASUK"
    }).populate(['pengirim', 'penerima', 'melon']);

    if (result) {
        res
      .status(200)
      .send({
        status: true,
        message: result,
      })
      .end();
    } else {
        res
      .status(400)
      .send({
        status: false,
        message: "transaksi not found",
      })
      .end();
  }
})

webRouter.get('/transaksi/terkonfirmasi', async (req, res) => {
    const result = await webTransaksiModel.find({
        status: "TERKONFIRMASI"
    }).populate(['pengirim', 'penerima', 'melon']);

    if (result) {
        res
      .status(200)
      .send({
        status: true,
        message: result,
      })
      .end();
    } else {
        res
      .status(400)
      .send({
        status: false,
        message: "transaksi not found",
      })
      .end();
  }
})

webRouter.get('/transaksi/keluar', async (req, res) => {
    const result = await webTransaksiModel.find(
        // { status: "TERKONFIRMASI"}
    ).populate(['pengirim', 'penerima', 'melon']);

    if (result) {
        res
      .status(200)
      .send({
        status: true,
        message: result,
      })
      .end();
    } else {
        res
      .status(400)
      .send({
        status: false,
        message: "transaksi not found",
      })
      .end();
  }
})


module.exports = webRouter;