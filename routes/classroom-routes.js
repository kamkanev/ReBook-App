const router = require("express").Router();
const User = require("../models/user");
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

    if(req.body.type == "private"){
      errs.push({
          msg: "Моля попълни всички полета!"
      });
    }

    res.render("classrooms", {
      user: req.user,
      errs
    });

  }else{
    res.redirect('/profile/classrooms');
  }



});

module.exports = router;
