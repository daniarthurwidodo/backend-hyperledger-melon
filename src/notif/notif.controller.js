const { Router } = require("express");
const notifRouter = Router();
const User = require("../user/user.model");
const Notif = require("./notif.model");
const Pusher = require("pusher");
const mongoose = require("mongoose");

const pusher = new Pusher({
  appId: "1787407",
  key: "acbf3ffd05480b00732c",
  secret: "9b567fee6d12db55b36b",
  cluster: "ap1",
  useTLS: true,
});

notifRouter.post("/send", async (req, res, next) => {
  try {
    let message = {
      pengirim : req.body.pengirim,
      penerima : req.body.penerima,
      trxId : req.body.trxId,
      deskripsi: req.body.deskripsi
    }

    pusher.trigger("melon-channel", "notif-event", {
      message: message,
    });

    // let user = await User.find();
    // if (user) {
    //   for (let index = 0; index < user.length; index++) {
    //     await Notif.create({
    //       to: req.body.to,
    //       from: req.body.from,
    //       message: req.body.message,
    //       date: new Date(),
    //       user: user[index]._id,
    //     });
    //   }
    // }


    res
      .status(200)
      .send({
        status: true,
        message: message,
      })
      .end();
  } catch (error) {
    let _error = new Error(error);
    res.status(400).send({
      status: false,
      message: "error send notif",
      error: _error,
    });
    res.end();
  }
});

notifRouter.post("/terbaca", async (req, res, next) => {
  try {
    let _notifId = new mongoose.Types.ObjectId(req.body.notifId);
    let notif = await Notif.findOneAndUpdate(
      {_id: req.body.notifId} ,
      { isRead: true }
    );
    console.log(notif , req.body.notifId, req.body);
      res
        .status(200)
        .send({
          status: true,
          message: notif,
        })
        .end();
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "error",
      error: error,
    });
    res.end();
  }
});

notifRouter.get("/:userId", async (req, res, next) => {
  try {
    let userId = new mongoose.Types.ObjectId(req.params.userId);
    let user = await User.find({ _id: userId });
    if (user) {
      let messages = await Notif.find({ user: userId });

      res
        .status(200)
        .send({
          status: true,
          message: messages,
        })
        .end();
    } else {
      throw new Error("id error");
    }
  } catch (error) {
    let _error = new Error(error);
    res.status(400).send({
      status: false,
      message: "error",
      error: _error,
    });
    res.end();
  }
});

module.exports = notifRouter;
