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
      pengirim: req.body.pengirim,
      penerima: req.body.penerima,
      trxId: req.body.trxId,
      deskripsi: req.body.deskripsi,
    };

    pusher.trigger("melon-channel", "notif-event", {
      message: message,
    });

    let notif = await Notif.create({
      pengirim: req.body.pengirim,
      penerima: req.body.penerima,
      trxId: req.body.trxId,
      deskripsi: req.body.deskripsi,
      date: new Date(),
    });

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

notifRouter.post("/terbaca/", async (req, res, next) => {
  try {
    let users = req.body.users;
    let message = []
    if (users.length > 0) {
      for (let index = 0; index < users.length; index++) {
        let _notifId = new mongoose.Types.ObjectId(req.params.notifId);
        let notif = await Notif.findOneAndUpdate(
          { _id: users[index] },
          { isRead: true }
        );
        console.log(notif);
        message.push(notif)
      }
      res
        .status(200)
        .send({
          status: true,
          message: message,
        })
        .end();
    }
  } catch (error) {
    res.status(501).send({
      status: false,
      message: "error",
      error: error,
    });
    res.end();
  }
});

notifRouter.get("/list/:userId", async (req, res, next) => {
  try {
    let messages = await Notif.find({ penerima: req.params.userId });
    if (messages.length === 0) {
      res.status(501).send({
        status: false,
        message: "user not found",
      });
      res.end();
    } else {
      res
        .status(200)
        .send({
          status: true,
          message: messages,
        })
        .end();
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
