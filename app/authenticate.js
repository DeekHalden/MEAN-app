require('dotenv').config();;
const passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy,
 User = require('./models/user'),
 FacebookStrategy = require('passport-facebook').Strategy

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.facebook = passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_clientID,
  clientSecret: process.env.FACEBOOK_clientSecret,
  callbackURL: process.env.FACEBOOK_callbackURL
  },
  (accessToken, refreshToken, profile, done) =>{
    User.findOne({ OauthId: profile.id }, (err, user) =>{
      if(err) {
        console.log(err); // handle errors!
      }
      if (!err && user !== null) {
        done(null, user);
      } else {
        user = new User({
          username: profile.displayName
        });
        user.OauthId = profile.id;
        user.OauthToken = accessToken;
        user.save((err) =>{
          if(err) {
            console.log(err); // handle errors!
          } else {
            console.log("saving user ...");
            done(null, user);
          }
        });
      }
    });
  }
));