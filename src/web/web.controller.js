const { Router } = require("express");
const userWebModel = require("../user/user.model");
const webBcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const Notif = require("../notif/notif.model");
const Transaksi = require("../transaksi/transaksi.model");

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
      req.body.password = await webBcrypt.hash(req.body.password, 10);
      // create a new user
      await userWebModel.create(req.body);

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
    const user = await userWebModel.findOne({ email: req.body.email });
    // const result = await webBcrypt.compare(req.body.password, user.password);

    if (user && user.role === "admin") {
      res.status(200).send({ status: true, message: user });
      res.end();
    } else if (user && user.role !== "admin") {
      res.status(401).send({
        status: false,
        message: "anda bukan admin!",
      });
      res.end();
    } else if (!user) {
      res.status(401).send({
        status: false,
        message: "harap periksa username / password",
      });
      res.end();
    } else {
      console.log(user);
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

webRouter.get("/transaksi/", async (req, res) => {
  let reqArr = [];

  for (let i = 0; i < req.body.jenisTransaksi.length; i++) {
    let result = await Transaksi.find({
      jenisTransaksi: req.body.jenisTransaksi[i],
    }).count();
    reqArr.push({  name : req.body.jenisTransaksi[i] , result: result });
  }
  try {
    res
      .status(200)
      .send({
        status: true,
        message: reqArr,
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        status: false,
        message: "transaksi not found",
        error: error,
      })
      .end();
  }
});

webRouter.get("/transaksi/role", async (req, res) => {
  try {
    let request = req.body.role;
    const result = await Transaksi.find().populate({
      path: "pengirim",
      match: { role: { $eq: request } },
    });
    res
      .status(200)
      .send({
        status: true,
        message: result,
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        status: false,
        message: "transaksi not found",
        error: error,
      })
      .end();
  }
});

webRouter.get("/notif/all", async (req, res) => {
  try {
    const result = await Notif.find({});

    res
      .status(200)
      .send({
        status: true,
        message: result,
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        status: false,
        message: "transaksi not found",
        error: error,
      })
      .end();
  }
});

module.exports = webRouter;
