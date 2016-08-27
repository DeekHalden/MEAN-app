var express = require('express');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var bodyParser = require('body-parser')
var checkoutRouter = express.Router();

var sinchAuth = require('sinch-auth');

var sinchSms = require('sinch-messaging');
var auth = sinchAuth("a0bef58b-fc27-49d8-b2d4-2a60c5c6ec9b", "2Mkqe6fsrUqNwovNW2KMew==");

checkoutRouter.use(bodyParser.json());

checkoutRouter.route('/')
    .post(function(req, res, next) {
        var userData = req.body[req.body.length - 1];
    	var userDetails = 'Пользователь ' + userData.name + ' из города ' + userData.place.address_components[0].long_name + ' заказал доставку в отделение \#' + userData.delivery + ' Метод оплаты:'+userData.method+'. Email:  ' + userData.email + ' телефон: ' + userData.telephone + ' Свяжитесь как можно скорее!';

    	var arr = req.body[0];
    	console.log(arr);

    	var orderDetails = arr.map(function(item) {
    		
                return ''+item._name + ' в количестве ' + item._quantity + 'шт. с общей стоимостью ' + (item._price * item._quantity / 100) + ' грн. ';
        });

    	orderDetails += userDetails;

        var auth = {
                auth: {
                    api_key: 'key-d40c168dc6123dfc8c143ccf1c1525ea',
                    domain: 'sandbox693909a1fb8a47879f32c3008dc45248.mailgun.org'
                }
            }
            sinchSms.sendMessage("+380668313993", orderDetails);
            //Setup Nodemailer transport, I chose gmail. Create an application-specific             password to avoid problems.
        var transporter = nodemailer.createTransport(mg(auth));

        var mailOptions = {
            from: '' + userData.name + ' <' + userData.email + '>',
            to: 'iliy4@ua.fm',
            subject: 'Email form my Page',
            text: orderDetails 
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                res.json({ yo: 'error' });
            } else {
                console.log('Message sent: ' + info);

                res.json({ yo: 'You message seccessfully send, You may return to previous page.' });
            };
        });
    })

module.exports = checkoutRouter;
