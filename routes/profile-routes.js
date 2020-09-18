const router = require("express").Router();
const User = require("../models/user");
const fs = require('fs');

router.get('/', (req, res) => {
  if(req.user){

    var tasks = undefined;

    var dir = './users/'+req.user.id+'/tasks.txt';
    if(fs.existsSync(dir)){

      tasks = [];

      var data = fs.readFileSync(dir,
            {encoding:'utf8', flag:'r'});

      var dataLogins = fs.readFileSync('./users/'+req.user.id+'/logins.txt',
            {encoding: 'utf8', flag:'r'});

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

      console.log(req.body);

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

router.post('/addTask', (req, res) => {

  if(req.user){

    console.log(req.body);

    var content = req.body.id+"~"+req.body.checked+"~"+req.body.name;

    var dir = './users/'+req.user.id+'/tasks.txt';

    if(!fs.existsSync(dir)){
      try{
        fs.writeFileSync(dir, content);
      }catch(e){
        console.log('cannot write file', e);
      }
    }else{
      var data = fs.readFileSync(dir,
            {encoding:'utf8', flag:'r'});

            console.log(data);

            data += '\n'+content;
            try{
              fs.writeFileSync(dir, data);
            }catch(e){
              console.log('cannot write file', e);
            }

    }

    res.redirect('/profile/');

  }

});

router.post('/updateTask', (req, res) => {

  if(req.user){

    var dir = './users/'+req.user.id+'/tasks.txt';

    if(fs.existsSync(dir)){

          console.log(req.body);

      var data = fs.readFileSync(dir,
            {encoding:'utf8', flag:'r'});

      var arr1 = data.split('\n');
      var newArr = [];

      for(var i = 0; i< arr1.length; i++){
        var rawData = arr1[i].split('~');
          if(rawData[0] == req.body.id){
            rawData[1] = req.body.checked;
            rawData[2] = req.body.name;
          }
          var line = rawData[0] + '~' + rawData[1] + '~' + rawData[2];
          newArr.push(line);
      }

      var newData = newArr[0];

      for(var i = 1; i< newArr.length; i++){
          newData+= '\n' + newArr[i];
      }

      fs.writeFileSync(dir, newData);

    }

    res.redirect('/profile/');

  }

});

router.post('/editTask', (req, res) => {

  if(req.user){

    var dir = './users/'+req.user.id+'/tasks.txt';

    if(fs.existsSync(dir)){

          console.log(req.body);

      var data = fs.readFileSync(dir,
            {encoding:'utf8', flag:'r'});

      var arr1 = data.split('\n');
      var newArr = [];

      for(var i = 0; i< arr1.length; i++){
        var rawData = arr1[i].split('~');
          if(rawData[0] == req.body.id){
            rawData[1] = req.body.checked;
            rawData[2] = req.body.name;
          }
          var line = rawData[0] + '~' + rawData[1] + '~' + rawData[2];
          newArr.push(line);
      }

      var newData = newArr[0];

      for(var i = 1; i< newArr.length; i++){
          newData+= '\n' + newArr[i];
      }

      fs.writeFileSync(dir, newData);

    }

    res.redirect('/profile/');

  }

});

router.post('/deleteTask', (req, res) => {

  if(req.user){

    var dir = './users/'+req.user.id+'/tasks.txt';

    if(fs.existsSync(dir)){

          console.log(req.body);

      var data = fs.readFileSync(dir,
            {encoding:'utf8', flag:'r'});

      var arr1 = data.split('\n');
      var newArr = [];

      for(var i = 0; i< arr1.length; i++){
        var rawData = arr1[i].split('~');
          if(rawData[0] != req.body.id){
            var line = rawData[0] + '~' + rawData[1] + '~' + rawData[2];
            newArr.push(line);
          }

      }

      var newData = newArr[0];


      for(var i = 1; i< newArr.length; i++){
          newData+= '\n' + newArr[i];
      }


      if(newData == undefined){
        fs.unlinkSync(dir);
      }else{
        fs.writeFileSync(dir, newData);
      }

    }

    res.redirect('/profile/');

  }

});

router.get("/classrooms", (req, res) => {
    if(req.user){

        res.render("classrooms", {
            user: req.user
        });

    }else{
        res.redirect('/');
    }
});

router.get("/ebooks", (req, res) => {
    if(req.user){

        res.render("ebooks", {
            user: req.user
        });

    }else{
        res.redirect('/');
    }
});

router.get("/calendar", (req, res) => {
    if(req.user){


            res.render("calendar", {
                user: req.user
            });



    }else{
        res.redirect('/');
    }
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

router.get("/settings", (req, res) => {
    if(req.user){

        res.render("settings", {
            user: req.user
        });

    }else{
        res.redirect('/');
    }
});

module.exports = router;
