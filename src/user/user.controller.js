const { Router } = require("express"); // import router from express
const User = require("./user.model"); // import user model
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg"); //Appending .jpg
  },
});

var upload = multer({ storage: storage });

const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      console.log("user sudah registrasi");
      res.status(201).send({
        status: false,
        message: "user sudah pernah registrasi",
      });
      res.end();
    } else if (!user) {
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
    });
    res.end();
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const result = await bcrypt.compare(req.body.password, user.password);

    if (user && result) {
      res.status(200).send({ status: true, message: user });
      res.end();
    } else if (!user) {
      res.status(401).send({
        status: false,
        message: "harap periksa username / password",
      });
      res.end();
    } else {
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

userRouter.put("/update/:user", upload.single("avatar"), async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.findOneAndUpdate(
      { username: req.params.user },
      { 
        nama: req.body.nama, 
        password: req.body.password,
        email: req.body.email,
        noHandphone: req.body.noHandphone,
        avatar: req.file.path 
      },
      { new: true }
    );
    res.status(200).send({ status: true, message: user });
    res.end();
  } catch (error) {
    res.status(401).send({
      status: false,
      message: "gagal update",
      error: error,
    });
    res.end();
  }
});

userRouter.get("/role/:role", async (req, res) => {
  try {
    const users = await User.find({ role: req.params.role });
    res.status(200).send({ status: true, message: users });
    res.end();
  } catch (error) {
    res.status(401).send({
      status: false,
      message: "gagal dapat user",
      error: error,
    });
    res.end();
  }
});

module.exports = userRouter;
