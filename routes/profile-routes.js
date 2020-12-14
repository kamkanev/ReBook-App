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

      var books = []

      const directoryPathNBooks = './users/'+req.user.id+'/nbook'
      const directoryPathVBooks = './users/'+req.user.id+'/vbook'

      var files1 = fs.readdirSync(directoryPathNBooks);
      var files2 = fs.readdirSync(directoryPathVBooks);

      for(var i =0; i < files1.length; i++){
        var file = files1[i];
        var fileDir = directoryPathNBooks + '/' + file + "/info.txt";
        var filesInNbook = fs.readdirSync(directoryPathNBooks + '/' + file);
        var data = fs.readFileSync(fileDir,
                                    {encoding:'utf8', flag:'r'}).split('\n');

        books.push({
          title: data[0],
          type: data[1],
          icon: data[2],
          len: (filesInNbook.length-1),
          opened: JSON.parse(data[3].toLowerCase()),
          openPage: parseInt(data[4]),
          fullLink: ( directoryPathNBooks + '/' + file)
        });

      }

      for(var i =0; i < files2.length; i++){
        var file = files2[i];
        var fileDir = directoryPathVBooks + '/' + file + "/info.txt";
        var filesInVbook = fs.readdirSync(directoryPathVBooks + '/' + file);
        var data = fs.readFileSync(fileDir,
                                    {encoding:'utf8', flag:'r'}).split('\n');

                                    books.push({
                                      title: data[0],
                                      type: data[1],
                                      icon: data[2],
                                      len: (filesInVbook.length-1),
                                      opened: JSON.parse(data[3].toLowerCase()),
                                      openPage: parseInt(data[4]),
                                      fullLink: ( directoryPathVBooks + '/' + file)
                                    });

      }

      console.log(books);

        res.render("ebooks", {
            user: req.user,
            books: books
        });

    }else{
        res.redirect('/');
    }
});

router.post("/createBook", (req, res) => {
  if(req.user){

    var data = req.body;

    var length = 0;
    //joining path of directory
    const directoryPath = './users/'+req.user.id+'/'+req.body.type;

        //console.log(length);
        var dir = directoryPath + "/" + req.body.title;
        var infoPath = dir + "/" + "info.txt";

        let info = req.body.title+"\n"+req.body.type+"\n"+"../img/books/covers/"+req.body.icon+"\n"+req.body.opened+"\n"+0;

        fs.mkdirSync(dir);
        fs.writeFileSync(infoPath, info);


    res.redirect('/profile/ebooks');

  }

});

router.post("/savePage", (req, res) => {

  if(req.user){

    // var data = req.body;

    const directoryPath = './users/'+req.user.id+'/'+req.body.type;

    var fileDir = directoryPath +"/"+req.body.title+"/info.txt";
    var filePage = directoryPath +"/"+req.body.title+"/seite"+req.body.page+".html";

    // var fileData = fs.readFileSync(fileDir,
    //                             {encoding:'utf8', flag:'r'}).split('\n');
    //
    // var newInfo = fileData[0]+"\n"+fileData[1]+"\n"+fileData[2]+"\n"+req.body.opened+"\n"+(req.body.page);

    fs.writeFileSync(filePage, req.body.text);

  }

  res.redirect('/profile/ebooks');

});

router.post("/createPage", (req, res) => {

  if(req.user){

    // var data = req.body;

    const directoryPath = './users/'+req.user.id+'/'+req.body.type;

    var nextPageNum = (parseInt(req.body.page)+1);

    var fileDir = directoryPath +"/"+req.body.title+"/info.txt";

    var data = fs.readFileSync(fileDir,
                                {encoding:'utf8', flag:'r'}).split('\n');

        data[4] = parseInt(data[4])+1;

    var filePage = directoryPath +"/"+req.body.title+"/seite"+req.body.page+".html";
    var fileNextPage = directoryPath +"/"+req.body.title+"/seite"+nextPageNum+".html";

    // var fileData = fs.readFileSync(fileDir,
    //                             {encoding:'utf8', flag:'r'}).split('\n');
    //
    // var newInfo = fileData[0]+"\n"+fileData[1]+"\n"+fileData[2]+"\n"+req.body.opened+"\n"+(req.body.page);

    fs.writeFileSync(filePage, req.body.text);
    fs.writeFileSync(fileNextPage, "");
    fs.writeFileSync(fileDir, data[0]+"\n"+data[1]+"\n"+data[2]+"\n"+data[3]+"\n"+data[4]+"\n");

  }

  res.redirect('/profile/ebooks');

});

router.post("/goToPage", (req, res) => {

  if(req.user){

    const directoryPath = './users/'+req.user.id+'/'+req.body.type;

    var number = parseInt(req.body.where);

    var len = fs.readdirSync(directoryPath +"/"+req.body.title+"/").length - 1;

    var fileDir = directoryPath +"/"+req.body.title+"/info.txt";

    var data = fs.readFileSync(fileDir,
                                {encoding:'utf8', flag:'r'}).split('\n');

        data[4] = parseInt(data[4])+number;

        if(data[4] >= len){
          data[4] = len-1;
        }else if(data[4] <= 0){
          data[4] = 0;
        }

      fs.writeFileSync(fileDir, data[0]+"\n"+data[1]+"\n"+data[2]+"\n"+data[3]+"\n"+data[4]+"\n");
  }

  res.redirect('/profile/ebooks');

});

router.post('/openBook', (req, res) =>{

if(req.user){

  var data = req.body;

  const directoryPath = './users/'+req.user.id+'/'+req.body.type;

  var fileDir = directoryPath +"/"+req.body.title+"/info.txt";

  var fileData = fs.readFileSync(fileDir,
                              {encoding:'utf8', flag:'r'}).split('\n');

  var newInfo = fileData[0]+"\n"+fileData[1]+"\n"+fileData[2]+"\n"+req.body.opened+"\n"+req.body.page;

  fs.writeFileSync(fileDir, newInfo);

}

  res.redirect('/profile/ebooks');

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

router.get("/tools", (req, res) => {
    if(req.user){

        res.render("tools", {
            user: req.user
        });

    }else{
        res.redirect('/');
    }
});

module.exports = router;
