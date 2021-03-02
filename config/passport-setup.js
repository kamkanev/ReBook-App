const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20");
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook');
const TwitterStrategy = require('passport-twitter').Strategy;
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
//        console.log();


      done(null, currentUser);
    }else{

      User.findOne({email: email}).then((eUser) => {
        if(eUser){

          eUser.googleid = profile.id;

          eUser.save().then((newUser) => {
          //  console.log('new User created' + newUser);

            done(null, newUser);
          });

        }else{

          //not exist
          new User({
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            username: getUsernameByMail(profile.emails[0].value),
    		      image: profile.photos[0].value,
            email: profile.emails[0].value,
            friends: [],
            googleid: profile.id
          }).save().then((newUser) => {
          //  console.log('new User created' + newUser);

            done(null, newUser);
          });

        }

      });


    }

  });

}));

passport.use(
  new FacebookStrategy(
    {
      callbackURL: '/auth/facebook/redirect',
      clientID: keys.facebook.clientID,
      clientSecret: keys.facebook.clientSecret,
      profileFields: ["email", "name", "photos", "id"]
    },
    function(accessToken, refreshToken, profile, done) {
      const { email, first_name, last_name } = profile._json;
      User.findOne({facebookid: profile.id}).then((currentUser) => {

        if(currentUser){
          //already exists
        //  console.log(`user is: ${currentUser}`);
    //        console.log();


          done(null, currentUser);
        }else{
          //console.log(profile);
          //not exist
          User.findOne({email: email}).then((eUser) => {

            if(eUser){

              eUser.facebookid = profile.id;

              eUser.save().then((newUser) => {
              //  console.log('new User created' + newUser);

                done(null, newUser);
              });

            }else{

              new User({
                first_name: first_name,
                last_name: last_name,
                username: getUsernameByMail(email),
                image: profile.photos[0].value,
                email: email,
                friends: [],
                facebookid: profile.id
              }).save().then((newUser) => {
              //  console.log('new User created' + newUser);

                done(null, newUser);
              });

            }

          });


        }

      });
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      callbackURL: '/auth/twitter/redirect',
      consumerKey: keys.twitter.clientID,
      consumerSecret: keys.twitter.clientSecret,
      userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
    },
    function(accessToken, refreshToken, profile, done) {
      const { email, name, profile_image_url, screen_name} = profile._json;
      var names = name.split(" ");
      // console.log(profile);
      User.findOne({twitterid: profile.id}).then((currentUser) => {

        if(currentUser){
          //already exists
        //  console.log(`user is: ${currentUser}`);
    //        console.log();


          done(null, currentUser);
        }else{
          // console.log(profile);
          //not exist
          User.findOne({email: email}).then((eUser) => {

            if(eUser){

              eUser.twitterid = profile.id;

              eUser.save().then((newUser) => {
              //  console.log('new User created' + newUser);

                done(null, newUser);
              });

            }else{

              new User({
                first_name: names[0],
                last_name: names[names.length-1],
                username: screen_name,
                image: profile_image_url,
                email: email,
                friends: [],
                twitterid: profile.id
              }).save().then((newUser) => {
              //  console.log('new User created' + newUser);

                done(null, newUser);
              });

            }

          });


        }

      });
    }
  )
);

function getUsernameByMail(email) {
  var t = "";
  for (var i = 0; i < email.indexOf("@"); i++) {
    t+=email[i];
  }
  return t;
}
