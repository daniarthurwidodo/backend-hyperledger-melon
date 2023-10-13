const { Router } = require("express");
const router = Router();
const User = require("../user/user.model"); // import user model
const Melon = require("../melon/melon.model");
router.get("/", (req, res) => {
  try {
    res.status(200).send({}).end();
  } catch (error) {
    res
      .status(400)
      .send({
        status: false,
        message: "",
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
      grade: req.body.grade
    }
    await Melon.create(body)
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

module.exports = router;
