const { Router } = require("express");
const router = Router();
const User = require("../user/user.model"); // import user model
const Melon = require("../melon/melon.model");

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const findUser = await User.findOne({ username: userId });
    const data = await Melon.find({ user: findUser._id })
      .skip(req.query.page)
      .limit(req.query.per_page);

    res
      .status(200)
      .send({
        status: true,
        message: data,
      })
      .end();
  } catch (error) {
    res
      .status(400)
      .send({
        status: false,
        message: "user not found",
      })
      .end();
  }
});

router.get("/qr/:melonId", async (req, res) => {
  try {
    const findMelonById = await Melon.findOne({
      _id: req.params.melonId,
    }).populate("user");

    res
      .status(200)
      .send({
        status: true,
        message: findMelonById,
      })
      .end();
  } catch (error) {
    res
      .status(400)
      .send({
        status: false,
        message: "melon not found",
      })
      .end();
  }
});

router.get("/", async (req, res) => {
  try {
    const findMelonById = await Melon.find().populate("user");
    res
      .status(200)
      .send({
        status: true,
        message: findMelonById,
      })
      .end();
  } catch (error) {
    res
      .status(400)
      .send({
        status: false,
        message: "melon not found",
      })
      .end();
  }
});

router.post("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const findUser = await User.findOne({ username: userId });
    const body = {
      user: findUser._id,
      tanggalRegistrasi: new Date(),
      tanggalTanam: req.body.tanggalTanam,
      tanggalPanen: req.body.tanggalPanen,
      jenisPupuk: req.body.jenisPupuk,
      jenisTanaman: req.body.jenisTanaman,
      namaVarietas: req.body.namaVarietas,
      grade: req.body.grade,
      kuantitas: req.body.kuantitas,
      lokasiKebun: req.body.lokasiKebun,
    };
    await Melon.create(body);
    res
      .status(200)
      .send({
        status: true,
        message: body,
      })
      .end();
  } catch (error) {
    res
      .status(400)
      .send({
        status: false,
        message: "user not found",
      })
      .end();
  }
});

router.put("/update/:melonId", async (req, res) => {
  let melonId = req.params.melonId;
  let body = req.body;
  try {
    const data = await Melon.findOneAndUpdate(
      {
        _id: melonId,
      },
      { ...body }
    );
    res.status(200).send({ status: true, message: data });
    res.end();
  } catch (error) {
    res
      .status(400)
      .send({
        status: false,
        message: "user not found",
      })
      .end();
  }
});

module.exports = router;
