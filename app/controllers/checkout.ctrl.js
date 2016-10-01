require('dotenv').config();
const nodemailer = require('nodemailer'),
 mg = require('nodemailer-mailgun-transport'),
 sinchAuth = require('sinch-auth'),
 sinchSms = require('sinch-messaging'),
 auth = sinchAuth(process.env.SINCH_API_KEY, process.env.SINCH_SECRET_KEY),
 api_key = process.env.MAILGUN_API_KEY,
 domain = process.env.MAILGUN_DOMAIN,
 phoneNumber = process.env.PHONE_NUMBER,
 targetedEmail = process.env.TARGETED_EMAIL


module.exports = {
	sendMail: (req,res,next) => {
        
		let userData = req.body[req.body.length - 1];
        console.log(userData);
        let userDetails = 'Пользователь ' + userData.name + ' из города ' + userData.place + ' заказал доставку в отделение \#' + userData.delivery + '\n Метод оплаты:'+userData.method+'. Email:  ' + userData.email + ' телефон: ' + userData.telephone + ' Свяжитесь как можно скорее!';

        let arr = req.body[0];
        console.log(arr);

        let orderDetails = arr.map(function(item) {
            
                return ''+item._name + ' в количестве ' + item._quantity + 'шт. с общей стоимостью ' + (item._price * item._quantity) + ' грн. \n';
        });

        orderDetails += userDetails;
        
        sinchSms.sendMessage(phoneNumber, orderDetails);

        let auth = {
                auth: {
                    api_key: api_key,
                    domain: domain
                }
            }
           
        let transporter = nodemailer.createTransport(mg(auth));

        let mailOptions = {
            from: '' + userData.name + ' <' + userData.email + '>',
            to: targetedEmail,
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
	}

}