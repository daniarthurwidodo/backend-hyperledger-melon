const { Router } = require("express");
const notifRouter = Router();
const axios = require("axios");

notifRouter.post("/send", async (req, res, next) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization:
      "bearer AAAAj4p9vzU:APA91bEHOcLB6w2BEW_5kTS9fTvRW2ypJ5V4loyjtik9d8M6Y_Os1JnNVyJQsImY763TMlEIBfk0HD3rHX8l9wKIwTVvqOpg6eeI3ZH0qAVJpiiExyUvh5M1gckU0CcPGV5TGK0_sdE8",
  };
  let sendNotif = await axios
    .post(
      "https://fcm.googleapis.com/fcm/send",
      {
        to: "/topics/alerts",
        data: {
          title: req.body.title,
          body: req.body.body,
        },
      },
      {
        headers: headers,
      }
    )
    .then((res) => {
      return res.status;
    })
    .catch((error) => {
      res.status(500).send({
        status: false,
        message: error,
      });
      res.end();
    });
  if (sendNotif === 200) {
    res.status(200);
    res.send({
      status: true,
      message: sendNotif,
    });
    res.end();
  } else {
    res.status(500).send({
      status: false,
      message: error,
    });
    res.end();
  }
});

module.exports = notifRouter;
