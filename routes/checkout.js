const express = require('express'),
      checkoutRouter = express.Router(),
      sendMailCtrl = require('../controllers/checkout.ctrl'),
      bodyParser = require('body-parser')

checkoutRouter.use(bodyParser.json());

checkoutRouter.route('/')
    .post(sendMailCtrl.sendMail);

module.exports = checkoutRouter;
