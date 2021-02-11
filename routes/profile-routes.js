const router = require("express").Router();
const User = require("../models/user");
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const rimraf = require("rimraf");

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
        var filebookDir = directoryPathVBooks + '/' + file + "/data.json";
        var filesInVbook = fs.readdirSync(directoryPathVBooks + '/' + file);
        var data = fs.readFileSync(fileDir,{encoding:'utf8', flag:'r'}).split('\n');

        var bookData = fs.readFileSync(filebookDir,{encoding:'utf8', flag:'r'});

        console.log("bookData: "+bookData);

                                    books.push({
                                      title: data[0],
                                      type: data[1],
                                      icon: data[2],
                                      len: (bookData.length <= 0)? 0 : (filesInVbook.length-1),
                                      opened: JSON.parse(data[3].toLowerCase()),
                                      openPage: parseInt(data[4]),
                                      fullLink: ( directoryPathVBooks + '/' + file),
                                      data: bookData
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

router.post("/createNewWord", (req, res) => {
  if(req.user){

    const directoryPath = './users/'+req.user.id+'/'+req.body.bookType + '/' + req.body.bookTitle;

    var readDir1 = fs.readdirSync(directoryPath);

    var word = {
      name: req.body.word,
      multiple: req.body.Mword,
      translate: req.body.trWord,
      transcr: req.body.transcr,
      type: "" + req.body.wType
    }

    if(readDir1.length - 1 <= 0){
      console.log("create FIle");

      //console.log(req.body.wType);

      var words = [];
      words.push(word);

      let data = JSON.stringify(words);

      fs.writeFileSync(directoryPath+"/data.json", data);

    }else{

      var fileData = fs.readFileSync(directoryPath+"/data.json",{encoding:'utf8', flag:'r'});

      var words = (fileData.length<=0) ? [] : JSON.parse(fileData);

      //console.log(word);

      if(words.findIndex(x => x.name === word.name) < 0){

        words.push(word);

      }

      console.log(words);

      console.log("updateFIle");

      let data = JSON.stringify(words);

      fs.writeFileSync(directoryPath+"/data.json", data);
    }

    res.redirect('/profile/ebooks');
  }
});

router.post("/createBook", (req, res) => {
  if(req.user){

    var data = req.body;

    var length = 0;

    const directoryPathNBooks = './users/'+req.user.id+'/nbook';
    const directoryPathVBooks = './users/'+req.user.id+'/vbook';
    //joining path of directory
    const directoryPath = './users/'+req.user.id+'/'+req.body.type;

        //console.log(length);
        var dir = directoryPath + "/" + req.body.title;
        var infoPath = dir + "/" + "info.txt";
        var seitePath = dir + "/" + "seite0.html";
        var dataPath = dir + "/" + "data.json";

        let info = req.body.title+"\n"+req.body.type+"\n"+"../img/books/covers/"+req.body.icon+"\n"+req.body.opened+"\n"+0;

        if(!fs.existsSync(directoryPathNBooks + "/" + req.body.title)){
          if(!fs.existsSync(directoryPathVBooks + "/" + req.body.title)){
            fs.mkdirSync(dir);
            fs.writeFileSync(infoPath, info);
            if(req.type == 'nbook'){
              fs.writeFileSync(seitePath, "");
            }else{
              fs.writeFileSync(dataPath, "");
            }
          }
        }


    res.redirect('/profile/ebooks');

  }

});

router.post("/deleteBooks", (req, res) => {
  if(req.user){

    var data = req.body;

    // console.log("delete data - ");

    const directoryPath = './users/'+req.user.id+'/';

    if(data.titles instanceof Array){
      for(var i = 0; i < data.titles.length; i++){

        var books = data.titles[i];

        console.log(books);

        var tit = books.split("|")[0];
        var typ = books.split("|")[1];

        console.log(tit, typ);

        console.log(directoryPath+typ+"/"+tit);
        rimraf.sync(directoryPath+typ+"/"+tit);
      }
    }else{

      var books = data.titles;

      console.log(books);

      var tit = books.split("|")[0];
      var typ = books.split("|")[1];

      console.log(tit, typ);

      console.log(directoryPath+typ+"/"+tit);
      rimraf.sync(directoryPath+typ+"/"+tit);

    }
        console.log("data delete - ", data);

  }

  res.redirect('/profile/ebooks');
});

router.post("/editBooks", (req, res) => {
  if(req.user){

    var data = req.body;

    // console.log("delete data - ");

    const directoryPath = './users/'+req.user.id+'/';

      var books = data.titles;
      var newbooks = data.newtitles;

      console.log(books);

      var tit = books.split("|")[0];
      var typ = books.split("|")[1];
      var icon = books.split("|")[2];

      var newtit = newbooks.split("|")[0];
      var newtyp = newbooks.split("|")[1];
      var newicon = newbooks.split("|")[2];

      console.log(tit, typ, icon);

      console.log(directoryPath+typ+"/"+tit);
      fs.renameSync(directoryPath+typ+"/"+tit, directoryPath+typ+"/"+newtit);

      const directoryPath2 = directoryPath+typ;

      var fileDir = directoryPath2 +"/"+newtit+"/info.txt";

      var fileData = fs.readFileSync(fileDir,
                                  {encoding:'utf8', flag:'r'}).split('\n');

      var fullIconLink = "../img/books/covers/"+newicon;

      var newInfo = newtit+"\n"+fileData[1]+"\n"+fullIconLink+"\n"+fileData[3]+"\n"+fileData[4];

      fs.writeFileSync(fileDir, newInfo);

  }

  res.redirect('/profile/ebooks');
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
