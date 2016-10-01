const express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    Verify = require('./verify'),
    UsersCtrl = require('../controllers/user.ctrl')


    router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, UsersCtrl.getAllUsers)

router.post('/register', UsersCtrl.register);

router.post('/login', UsersCtrl.login);

router.get('/logout', UsersCtrl.logout );

// router.get('/facebook', passport.authenticate('facebook'),
//     function(req, res) {});

// router.get('/facebook/callback', UsersCtrl.facebookCallback);

module.exports = router;
