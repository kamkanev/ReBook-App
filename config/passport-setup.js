const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20");
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./keys');
const User = require('../models/user');
const md5 = require('md5');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  });
});

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({username: username}, (err, user) => {
    if(err){
      return done(err);
    }
    if(!user){
      return done(null, false);
    }
    if(user == null){
      return done(null, false);
    }
    if(user.password != md5(password)){
      return done(null, false);
    }

    return done(null, user);
    //console.log(user);
  });
}));

passport.use(new GoogleStrategy({
  //options for the strategy
  callbackURL: '/auth/google/redirect',
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret
},(accessToken, refreshToken, profile, done) => {
  //check if user exist
  // console.log(profile.emails[0].value);
  User.findOne({googleid: profile.id}).then((currentUser) => {

    if(currentUser){
      //already exists
    //  console.log(`user is: ${currentUser}`);
      done(null, currentUser);
    }else{
      //not exist
      new User({
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        username: getUsernameByMail(profile.emails[0].value),
        email: profile.emails[0].value,
        friends: [],
        googleid: profile.id
      }).save().then((newUser) => {
      //  console.log('new User created' + newUser);

        done(null, newUser);
      });

    }

  });

}));

function getUsernameByMail(email) {
  var t = "";
  for (var i = 0; i < email.indexOf("@"); i++) {
    t+=email[i];
  }
  return t;
}
