const { Router } = require("express"); // import router from express
const router = Router(); // create router to create route bundle

const amqp = require('amqplib/callback_api');
const config = require('../../config.json')

router.post("/:source/:deviceID/:suhu", async (req, res) => {
    try {
        let body = req.body
        body.sourceGudang = req.params.source;
        body.deviceID = req.params.deviceID;
        body.suhu = req.params.suhu

        amqp.connect(config.rabbitmq_url, function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }

                var queue = 'monitor';
                var msg = JSON.stringify({ 
                    deviceID: body.deviceID, 
                    sourceGudang: body.sourceGudang,
                    suhu: body.suhu,
                    date: new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Jakarta',
                      }),
                })
                channel.assertQueue(queue, {
                    durable: false
                });
                channel.sendToQueue(queue, Buffer.from(msg));

                // console.log(" [x] Sent %s", msg);

                // connection.close();
                res.status(200)
                res.send(msg)
                res.end()
            });
        });



    } catch (error) {
        console.log(error)
    }

})

module.exports = router;