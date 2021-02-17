const router = require("express").Router();
const User = require("../models/user");
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const rimraf = require("rimraf");

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

module.exports = router;
