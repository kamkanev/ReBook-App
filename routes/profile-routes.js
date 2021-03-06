const router = require("express").Router();
const User = require("../models/user");
const fs = require('fs');
const md5 = require('md5');
const multer = require('multer');
const path = require('path');
const rimraf = require("rimraf");

const booksRoutes = require('./books-routes');
const tasksRoutes = require('./tasks-routes');
const classRoomRoutes = require('./classroom-routes');

router.use('', tasksRoutes);
router.use('', booksRoutes);
router.use('', classRoomRoutes);

router.get('/', (req, res) => {
  if(req.user){

    var tasks = undefined;

    var dir = './users/'+req.user.id+'/tasks.txt';

    if(!fs.existsSync('./users/'+req.user.id)){
      createUserFolder(req.user.id);
      updateUserLogin(req.user.id);
    }

    if(fs.existsSync(dir)){

      tasks = [];

      var data = fs.readFileSync(dir,
            {encoding:'utf8', flag:'r'});


      var arr1 = data.split('\n');

      for(var i = arr1.length-1; i>= 0; i--){
        var rawData = arr1[i].split('~');
        var task = {
          id: rawData[0],
          name: rawData[2],
          checked: rawData[1]
        };
        tasks.push(task);
      }

    }

    var dataLogins = fs.readFileSync('./users/'+req.user.id+'/logins.txt',
          {encoding: 'utf8', flag:'r'});

          // console.log(dataLogins);

        res.render("dashboard",{
          user: req.user,
          tasks: tasks,
          logins: dataLogins
        });

  }else{
    res.redirect('/');
  }
});

router.post("/edit", (req, res) => {

    if(req.user){

      const { fname, lname, uname, email, school } = req.body;

      var errs = [];

      if(!fname || !lname || !uname || !email || !school){

          errs.push({
              msg: "Моля попълни всички полета!"
          });

      }

      // console.log(req.body);

      if(errs.length <= 0){

          User.findById(req.user.id).then((currUser) => {

              if(currUser.username != uname){

                  User.findOne({username : uname}).then((uUser) => {

                      if(uUser){
                          errs.push({
                              msg: "Вече съществува такова потребителско име."
                          });

                          res.render("user", {
                              errs,
                              user: req.user
                          });
                      }else{


                           currUser.username = uname;

                          currUser.save((err) => {

                              if(err){
                                  return console.log("Error saving: " + err);
                              }
                              res.redirect('profile/user');

                          });




                      }

                  });

              }

              if(currUser.email != email){


                              User.findOne({email: email}).then((eUser) => {

                              if(eUser){

                                  errs.push({
                              msg: "Вече съществува профил с този email."
                          });

                          res.render("user", {
                              errs,
                              user: req.user
                          });

                              }else{

                                  currUser.email = email;

                                  currUser.save((err) => {

                                      if(err){
                                          return console.log("Error saving: " + err);
                                      }

                                      res.redirect('profile/user');

                                  });



                              }

                          });

                          }

              currUser.first_name = fname;
              currUser.last_name = lname;
              currUser.username = uname;
              currUser.school = school;

              currUser.save((err) => {

                  if(err){
                      return console.log("Error saving: " + err);
                  }
                  res.redirect("/profile/user");

              });



          });

      }else{
          res.render("user", {
              errs,
              user: req.user
          });
      }

    }


});

router.get("/calendar", (req, res) => {
    if(req.user){

      const directoryPath = './users/'+req.user.id;

      var fileData = fs.readFileSync(directoryPath+"/calendar.json",{encoding:'utf8', flag:'r'});

      var savedSched = "[]";

      if(fileData.length > 0){
        savedSched = fileData;

      }

      res.render("calendar", {
          user: req.user,
          events: savedSched
      });

    }else{
        res.redirect('/');
    }
});

router.post('/saveSched', (req, res) => {
    if(req.user){

      const directoryPath = './users/'+req.user.id;

      var fileData = fs.readFileSync(directoryPath+"/calendar.json",{encoding:'utf8', flag:'r'});

      var savedSched = [];

      var scheds = JSON.parse(req.body.scheds);

      if(fileData.length > 0){
        savedSched = JSON.parse(fileData);

      }

        savedSched.push(scheds);

        var newData = JSON.stringify(savedSched);

        fs.writeFileSync(directoryPath+"/calendar.json", newData);

    }

    res.redirect('/profile/calendar');
});

router.post('/editSched', (req, res) => {
    if(req.user){

      const directoryPath = './users/'+req.user.id;

      var fileData = fs.readFileSync(directoryPath+"/calendar.json",{encoding:'utf8', flag:'r'});

      var savedSched = [];

      var scheds = JSON.parse(req.body.scheds);

      if(fileData.length > 0){
        savedSched = JSON.parse(fileData);

        for(var i = 0; i < savedSched.length; i++){
            if(savedSched[i].id == scheds.id){
              savedSched[i] = scheds;
              break;
            }
        }

      }

        var newData = JSON.stringify(savedSched);

        fs.writeFileSync(directoryPath+"/calendar.json", newData);

    }

    res.redirect('/profile/calendar');
});

router.post('/delSched', (req, res) => {
    if(req.user){

      const directoryPath = './users/'+req.user.id;

      var fileData = fs.readFileSync(directoryPath+"/calendar.json",{encoding:'utf8', flag:'r'});

      var savedSched = [];

      var delInd = -1;

      var scheds = JSON.parse(req.body.scheds);

      if(fileData.length > 0){
        savedSched = JSON.parse(fileData);

        for(var i = 0; i < savedSched.length; i++){
            if(savedSched[i].id == scheds.id){
              delInd = i;
              break;
            }
        }

        if(delInd >= 0){
          savedSched.splice(i, 1);
        }

      }

        var newData = JSON.stringify(savedSched);

        fs.writeFileSync(directoryPath+"/calendar.json", newData);

    }

    res.redirect('/profile/calendar');
});

router.get("/user", (req, res) => {
    if(req.user){

        res.render("user", {
            user: req.user
        });

    }else{
        res.redirect('/');
    }
});

router.post("/upload-profile-pic", (req, res) => {

  if(req.user){
    var errs = [];
    const storage = multer.diskStorage({
      destination: function(reqS, file, cb) {
          cb(null, './users/'+ req.user.id +'/uploads/');
      },

      // By default, multer removes file extensions so let's add them back
      filename: function(reqF, file, cb) {
          cb(null, "account");
      }
  });

  const fileFIlter = function (req, file, callback) {
          var ext = path.extname(file.originalname);
          if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
              return callback(new Error('Only images are allowed'))
          }
          callback(null, true)
      };

  let upload = multer({ storage: storage, fileFilter: fileFIlter }).single('profile_pic');

  upload(req, res, function(err) {
      // req.file contains information of uploaded file
      // req.body contains information of text fields, if there were any

      if (req.fileValidationError) {
          errs.push({
              msg: req.fileValidationError
          });
      }
      else if (!req.file) {
          errs.push({
              msg: 'Моля изберете първо снимка!'
          });
      }
      else if (err instanceof multer.MulterError) {
          errs.push({
              msg: err
          });
      }
      else if (err) {
          errs.push({
              msg: err
          });
      }

      //console.log(req);

      if(errs.length<= 0){
        User.findById(req.user.id).then((currUser) => {

          currUser.image = '../users/'+ req.user.id +'/uploads/account';

          currUser.save((err) => {

              if(err){
                  return console.log("Error saving: " + err);
              }
              res.render("user", {
                user: currUser
              });

          });

        });
      }else{
        res.render("user",{
          user: req.user,
          errs
        })
      }

  });
  }
  // res.redirect('/');

});

router.get("/settings", (req, res) => {
    if(req.user){

        res.render("settings", {
            user: req.user
        });

    }else{
        res.redirect('/');
    }
});

router.post("/changeSettings", (req, res) => {
  if(req.user){

    var errs = [];

    const { pass, passconf, color } = req.body;

    if(pass.length <= 0 && passconf.length <= 0){
      User.findById(req.user.id).then((currUser) => {

        if(currUser){

          req.user.menucolor = color;
          currUser.menucolor = color;

          currUser.save((err) => {

              if(err){
                  return console.log("Error saving: " + err);
              }
              res.render("settings", {
                user: currUser,
                compMessage: {
                  msg: "Промените са запазени успешно!"
                }
              });
// res.redirect('/profile/settings');
          });

        }

      });
    }else{

      if(pass.length < 6){
        errs.push({ msg: "Паролата трябва да е поне 6 символа." });
      }

      if(pass != passconf){
        errs.push({
          msg: "Паролите не съвпадат"
        });
      }

      if(md5(pass) == req.user.password){
        errs.push({
          msg: "Паролата е подобна на предишната!"
        });
      }

      if(errs.length > 0){

        res.render("settings", {
          user: req.user,
          pass,
          passconf,
          errs
        });

      }else{
        User.findById(req.user.id).then((currUser) => {

          if(currUser){

            currUser.menucolor = color;
            req.user.menucolor = color;
            currUser.password = md5(pass);
            req.user.password = md5(pass);

            currUser.save((err) => {

                if(err){
                    return console.log("Error saving: " + err);
                }
                res.render("settings", {
                  user: currUser,
                  compMessage: {
                    msg: "Промените са запазени успешно!"
                  }
                });
                // res.redirect('/profile/settings');
            });

          }

        });
      }

    }

  }
  res.redirect('/profile/settings');
});

router.get("/tools", (req, res) => {
    if(req.user){

        res.render("tools", {
            user: req.user
        });

    }else{
        res.redirect('/');
    }
});

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

  if(!fs.existsSync((dir+"/calendar.json"))){
    try{
        fs.writeFileSync(dir+'/calendar.json', "");
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
