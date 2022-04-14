/*
 * @Author: sunny06
 * @Email: liyangyang06@zuoyebang.com
 * @Date: 2022-03-22 09:39:56
 * @LastEditors: sunny06
 * @LastEditTime: 2022-04-14 10:37:05
 * @Description: this is a file!
 */

const express = require("express");
let axios = require('axios');
let bodyParser = require('body-parser');
let webPush = require("web-push");
let util = require('util');
const app = express();

let subscribers = [];
const vapidKeys = {
  publicKey:
'BPvHcQb0LlI7o_HYfCj4oxk6soG1Opf2AuftNocaY2wuavMv0iQAKxyKpltRE8NkssfNnbHOIuJKFBTd9iGOj4g',
  privateKey: 'fqQZTwFcDM2FIQABkRbVSoBqdpXfpO_8vTJe0j8wOlA'
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

webPush.setVapidDetails(
  'mailto:DanielJoseydwizb@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

webPush.setGCMAPIKey('AAAAyO_bv3o:APA91bGrcqTfnzuUOqd8Xdm1lac23yFT8BzLkmfjifiOqxyYEUTKxz6fFLDy7xyY5TU2LIjMis3DuOugDGxx5YIHvPHhvHcQt74FT62n4wBWZeMj8w9NtfpVD9gK_VHyBtRvDDSowan5');

app.use(express.static(__dirname));

app.get('/api/list', async (req, res) => {
  const data = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20'
  ];
  const startSlice = Math.random() * 10 + 0; // 取0-10之间的随机数
  res.json(data.slice(startSlice, startSlice + 10));
});

app.post('/subscribe', function (req, res) {
  let endpoint = req.body['notificationEndPoint'];
  let publicKey = req.body['publicKey'];
  let auth = req.body['auth'];

  let pushSubscription = {
      endpoint: endpoint,
      keys: {
          p256dh: publicKey,
          auth: auth
      }
  };

  subscribers.push(pushSubscription);
  console.log(subscribers, 'Subscription accepted');
  res.send('Subscription accepted!');
});

app.post('/unsubscribe', function (req, res) {
  let endpoint = req.body['notificationEndPoint'];
  subscribers = subscribers.filter(subscriber => { endpoint == subscriber.endpoint });
  res.send('Subscription removed!');
});

app.get('/getPayload', function(req, res) {
  res.json({payload: 'http://localhost:9000/'});
})

app.get('/notify/all', function (req, res) {
  // if(req.get('auth-secret') != '13522450756') {
  //     console.log("Missing or incorrect auth-secret header. Rejecting request.");
  //     return res.sendStatus(401);
  // }

  let message = req.query.message || `Willy Wonka's chocolate is the best!`;
  let clickTarget = req.query.clickTarget || `http://localhost:9000/`;
  let title = req.query.title || `Push notification received!`;
  console.log(subscribers);
  subscribers.forEach(pushSubscription => {
      // Can be anything you want. No specific structure necessary.
      // let payload = new Buffer.from(JSON.stringify({message : message, clickTarget: clickTarget, title: title}), 'utf8');
      let payload = JSON.stringify({message : message, clickTarget: clickTarget, title: title});
      webPush.sendNotification(pushSubscription, payload).then((response) =>{
          console.log('response=========', response);
          console.log("Status : "+util.inspect(response.statusCode));
          console.log("Headers : "+JSON.stringify(response.headers));
          console.log("Body : "+JSON.stringify(response.body));
      }).catch((error) =>{
          console.log('error=========', error);
          console.log("Status : "+util.inspect(error.statusCode));
          console.log("Headers : "+JSON.stringify(error.headers));
          console.log("Body : "+JSON.stringify(error.body));
      });
  });

  res.send('Notification sent!');
});

app.listen("9000", () => {
  console.log("server start at localhost:9000");
})

