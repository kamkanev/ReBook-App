const router = require("express").Router();
const User = require("../models/user");
const md5 = require('md5');
const passport = require('passport');
const fs = require('fs');

router.get('/login', (req, res) => {
  if(req.user){
    res.redirect('/profile/');
  }else{
    res.render('login');
  }
});

router.get('/signup', (req, res) => {
  if(req.user){
    res.redirect('/profile/');
  }else{
    res.render('signup');
  }
});

router.post('/signup', (req, res) => {
  const { fname, lname, uname, email, password, password2 } = req.body;
  var errs = [];

  if(!fname || !lname || !uname || !email || !password || !password2){
    errs.push({ msg: "Моля попълнете всички полете!" });
  }
  if(password.length < 6){
    errs.push({ msg: "Паролата трябва да е поне 6 символа." });
  }

  if(password != password2){
    errs.push({ msg: "Паролите не съвпадат!" });
  }

  if(errs.length > 0){
    res.render("signup", {
        fname,
        lname,
        uname,
        email,
        password,
        password2,
        errs
    });
  }else{
  //   var user = new User({
  //     first_name: fname,
  //     last_name: lname,
  //     username: uname,
  //     email: email,
  //     password: md5(password),
  //   //  friends: []
  // });
  // user.save(function (err, userN) {
  //   if (err){
  //      return console.error(err);
  //    }else{
  //   console.log(userN.username + " saved to Users collection.");
  // }
  // });
  //
  //   console.log("Vsichko e to4ko:    ---- "+ user);
    User.findOne({email: email}).then((currentUser) => {
    //  console.log("Proveri dali sushtestvuva...    -------");
      if (currentUser) {
      //  console.log(currentUser);
        errs.push({ msg: "Вече има потребител с този email!" });
        res.render("signup", {
            fname,
            lname,
            uname,
            email,
            password,
            password2,
            errs
        });
      }else{

        new User({
          first_name: fname,
          last_name: lname,
          username: uname,
          email: email,
          password: md5(password),
          friends: []
        }).save(function (err, userN) {
          if (err){

            errs.push({ msg: "Това потребителско име вече е заето!" });
            res.render("signup", {
                fname,
                lname,
                uname,
                email,
                password,
                password2,
                errs
            });

             }else{
            res.render("signup", {
                registered: true
            });
          }
        });

      }
    });

  }

});

//local s passpost

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/auth/login' }),
  function(req, res) {
    res.redirect('/profile/');
    //fs create folder
    //res.send(req.user.username);

    createUserFolder(req.user.id);
    updateUserLogin(req.user.id);

  });

  router.get('/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email']
  }));

  router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    //res.send(req.user);

    //fs create folder
    createUserFolder(req.user.id);
    updateUserLogin(req.user.id);

    res.redirect('/profile/')
  })

router.get('/logout', (req, res) => {
    //res.send('logging out');
    req.logout();
    res.redirect('/');
  });

//google s passport

function createUserFolder(id) {
  var dir = "./users/"+id;

  // console.log(fs.existsSync(dir));
  if(!fs.existsSync("./users")){
    fs.mkdirSync("./users")
  }

  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    fs.mkdirSync(dir+"/nbook");
    fs.mkdirSync(dir+"/vbook");
    fs.mkdirSync(dir+"/uploads");
  }

  if(!fs.existsSync((dir+"/logins.txt"))){
    try{
        fs.writeFileSync(dir+'/logins.txt', "0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0");
    }catch (e){
        console.log("Cannot write file ", e);
    }
  }
}

function updateUserLogin(id) {
  var dir = "./users/"+id;
  var login = dir+"/logins.txt";

  const data = fs.readFileSync(login, {
    encoding: 'utf8'
  });
  var nowDate = new Date();
  var months = data.split("\n");
  var mon = parseInt(months[nowDate.getMonth()]);

  mon++;

  var newData = "";

  for(var i = 0; i < 12; i++){
    if(i == nowDate.getMonth()){
      newData+= mon+"\n";
    }else{
      newData+=months[i]+"\n";
    }

  }
  // console.log(data);

  try{
      fs.writeFileSync(login, newData);
  }catch (e){
      console.log("Cannot write file ", e);
  }
}


module.exports = router;
