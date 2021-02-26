const router = require("express").Router();
const User = require("../models/user");
const ClassRoom = require('../models/classroom');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const rimraf = require("rimraf");


router.get("/classrooms", (req, res) => {
    if(req.user){

        res.render("classrooms", {
            user: req.user
        });

    }else{
        res.redirect('/');
    }
});

router.post('/createClassRoom', (req, res) => {

  if(req.user){

    console.log(req.body);

    var errs = [];

    if(req.body.type == "private" && req.body.password.length<=0){
      errs.push({
          msg: "Частни стаи трябва да имат парола!"
      });
    }

    if(req.body.type == "public" && req.body.password.length>0){
      errs.push({
          msg: "Публичните стаи не трябва да имат парола!"
      });
    }

    ClassRoom.findOne({name: req.body.name}).then((currClass) => {

      if(currClass){
        errs.push({
          msg: "Вече съществува стая с това име!"
        });

        res.render("classrooms", {
          user: req.user,
          errs
        });
      }else{

        var arr = [];
        arr.push(req.user.id);

        new ClassRoom({
          name: req.body.name,
          timeOfCreation: Date.parse(new Date()),
          description: req.body.desc,
          type: req.body.type,
          password: req.body.password,
          creator: req.user.id,
          moderators: [],
          members: arr,
          posts: [],
          chatrooms: []
        }).save((err, newClass) => {
          if(err){
            errs.push({
              msg: ""+err
            });

            res.render("classrooms", {
              user: req.user,
              errs
            });

          }else{

            // res.render("classrooms", {
            //   user: req.user,
            //   modu
            // });
            res.redirect('/profile/classrooms');

          }

        });

      }

    });




  }else{
    res.redirect('/profile/classrooms');
  }



});

module.exports = router;
