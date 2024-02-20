const { Router } = require("express"); // import router from express
const User = require("./user.model"); // import user model
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg");
  },
});

const upload = multer({ storage: storage });

const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const email = await User.findOne({ email: req.body.email });
    if (user && email) {
      console.log("user sudah registrasi");
      res.status(402).send({
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
    const status = () => {
      if (user.statusVerifikasi == "TERKONFIRMASI") {
        return true
      } else {
        return false
      }
    }
    if (user && result && status() ) {
      res.status(200).send({ status: true, message: user });
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
      res.status(401).send({
        status: false,
        message: "harap periksa username / password",
        statusUser: user.statusVerifikasi
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

userRouter.put("/update/:userID", upload.single("avatar"), async (req, res) => {
  try {
    // req.body.password = await bcrypt.hash(req.body.password, 10);
    let avatar_path = req.file.path
    avatar_path === undefined ? '' : req.file.path
    
    const user = await User.findOneAndUpdate(
      { _id: req.params.userID },
      {
        username: req.body.nama,
        role: req.body.role,
        email: req.body.email,
        noHandphone: req.body.noHandphone,
        avatar: avatar_path,
        statusVerifikasi: req.body.statusVerifikasi,
      },
      { new: true }
    );
    res.status(200).send({ status: true, message: user });
    res.end();
  } catch (error) {
    res.status(401).send({
      status: false,
      message: "gagal update",
      error: error.message, // body: error.message
    });
    res.end();
    // console.log(error);
  }
});

userRouter.put("/aktivasi/:userID", async (req, res) => {
  try {
    // req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.findOneAndUpdate(
      { _id: req.params.userID },
      {
        // username: req.body.nama,
        // role: req.body.role,
        // email: req.body.email,
        // noHandphone: req.body.noHandphone,
        // avatar: req.file.path,
        statusVerifikasi: "TERKONFIRMASI",
      },
      { new: true }
    );
    res.status(200).send({ status: true, message: user });
    res.end();
  } catch (error) {
    res.status(401).send({
      status: false,
      message: "gagal update",
      error: error.message, // body: error.message
    });
    res.end();
    // console.log(error);
  }
});

userRouter.put("/ditolak/:userID", async (req, res) => {
  try {
    // req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.findOneAndUpdate(
      { _id: req.params.userID },
      {
        // username: req.body.nama,
        // role: req.body.role,
        // email: req.body.email,
        // noHandphone: req.body.noHandphone,
        // avatar: req.file.path,
        statusVerifikasi: "DITOLAK",
      },
      { new: true }
    );
    res.status(200).send({ status: true, message: user });
    res.end();
  } catch (error) {
    res.status(401).send({
      status: false,
      message: "gagal update",
      error: error.message, // body: error.message
    });
    res.end();
    // console.log(error);
  }
});

userRouter.put("/aktif/:userID", async (req, res) => {
  try {
    // req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.findOneAndUpdate(
      { _id: req.params.userID },
      {
        // username: req.body.nama,
        // role: req.body.role,
        // email: req.body.email,
        // noHandphone: req.body.noHandphone,
        // avatar: req.file.path,
        statusVerifikasi: "AKTIF",
      },
      { new: true }
    );
    res.status(200).send({ status: true, message: user });
    res.end();
  } catch (error) {
    res.status(401).send({
      status: false,
      message: "gagal update",
      error: error.message, // body: error.message
    });
    res.end();
    // console.log(error);
  }
});
userRouter.put("/tidakAktif/:userID", async (req, res) => {
  try {
    // req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.findOneAndUpdate(
      { _id: req.params.userID },
      {
        // username: req.body.nama,
        // role: req.body.role,
        // email: req.body.email,
        // noHandphone: req.body.noHandphone,
        // avatar: req.file.path,
        statusVerifikasi: "TIDAK AKTIF",
      },
      { new: true }
    );
    res.status(200).send({ status: true, message: user });
    res.end();
  } catch (error) {
    res.status(401).send({
      status: false,
      message: "gagal update",
      error: error.message, // body: error.message
    });
    res.end();
    // console.log(error);
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

userRouter.get("/user/:userID", async (req, res) => {
  console.log(req.params.userID);
  try {
    const users = await User.findOne({ _id: req.params.userID });
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
userRouter.delete("/user/:userID", async (req, res) => {
  try {
    const users = await User.findOneAndDelete({ _id: req.params.userID });
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

userRouter.get("/all/dashboard", async (req, res) => {
  try {
    const users = await User.find({ role: "admin" });
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

userRouter.get("/all/mobile", async (req, res) => {
  try {
    const users = await User.find({
      $or: [{ role: "petani" }, { role: "distributor " }, {role: "retail"}],
    });
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
