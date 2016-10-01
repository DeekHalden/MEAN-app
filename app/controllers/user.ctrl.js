const User = require('../models/user'),
    passport = require('passport');

module.exports = {
    getAllUsers: (req, res, next) => {
        User.find({}, (err, user) => {
            if (err) {
                return res.status(500).json({
                    err: 'not enough privileges '
                });
            }
            res.json(user);
        });
    },
    register: (req, res) => {
        User.register(new User({ username: req.body.username }),
            req.body.password, (err, user) => {
                if (err) {
                    return res.status(500).json({ err: err });
                }
                if (req.body.firstname) {
                    user.firstname = req.body.firstname;
                }
                if (req.body.lastname) {
                    user.lastname = req.body.lastname;
                }
                user.save((err, user) => {
                    passport.authenticate('local')(req, res, () => {
                        return res.status(200).json({ status: 'Registration Successful!' });
                    });
                });
            });
    },
    login: (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({
                    err: info
                });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return res.status(500).json({
                        err: 'Could not log in user'
                    });
                }

                var token = Verify.getToken({ "username": user.username, "_id": user._id, "admin": user.admin });
                res.status(200).json({
                    status: 'Login successful!',
                    success: true,
                    token: token,
                    admin: user.admin
                });
            });
        })(req, res, next);
    },
    logout: (req, res) => {
        req.logout();
        res.status(200).json({
            status: 'Bye'
        });
    }
    // unused
    // facebookCallback: (req, res, next) =>{
    // passport.authenticate('facebook', (err, user, info) =>{
    //     if (err) {
    //         return next(err);
    //     }
    //     if (!user) {
    //         return res.status(401).json({
    //             err: info
    //         });
    //     }
    //     req.logIn(user, (err) =>{
    //         if (err) {
    //             return res.status(500).json({
    //                 err: 'Could not log in user'
    //             });
    //         }
    //         var token = Verify.getToken({ "username": user.username, "_id": user._id, "admin": user.admin });
    //         res.status(200).json({
    //             status: 'Login successful!',
    //             success: true,
    //             token: token
    //         });
    //     });
    // })(req, res, next);


}
