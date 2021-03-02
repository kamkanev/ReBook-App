const router = require("express").Router();
const User = require("../models/user");
const ClassRoom = require('../models/classroom');

router.get("/:classId", (req, res) => {

  if(req.user){

    // console.log(req.params.classId);

    ClassRoom.findById(req.params.classId).then((currClass) => {

      if(currClass){

        // console.log(currClass);

        if(currClass.members.includes(req.user.id)){

          User.findOne({username: req.user.username}).then((currUser) => {

            if(currUser){

              currUser.inClassRoom = currClass.id;

              currUser.save((err) => {
                if(err){
                    return console.log("Error saving: " + err);
                }
                // res.redirect('/class/:classId');
                res.render("class", {
                  user: currUser,
                  room: currClass
                });
                // console.log(currClass, currUser);
              });

            }

          });

        }

      }

    });

  }else{
      res.redirect('/profile/classrooms');
  }



});

router.get("/:classId/exit", (req, res) => {

  if(req.user){

    User.findOne({username: req.user.username}).then((currUser) => {

      if(currUser){

        currUser.inClassRoom = undefined;

        currUser.save((err) => {
          if(err){
              return console.log("Error saving: " + err);
          }
          // console.log(currUser);
          // res.redirect('/class/:classId');
          res.redirect('/profile/classrooms');
        });

      }

    });

  }else{
    res.redirect('/profile/classrooms');
  }



});

router.get('/:classId/leave', (req, res) => {

  if(req.user){

    ClassRoom.findById(req.params.classId).then((currRoom) => {

      if(currRoom){

          var index = currRoom.members.indexOf(req.user.id);

          if(index > -1){

                      currRoom.members.splice(index, 1);

                      currRoom.save((err) => {

                        if(err){
                            return console.log("Error saving: " + err);
                        }
                        // console.log(currUser);
                        // res.redirect('/class/:classId');
                        User.findOne({username: req.user.username}).then((currUser) => {

                          if(currUser){

                            currUser.inClassRoom = undefined;

                            currUser.save((err) => {
                              if(err){
                                  return console.log("Error saving: " + err);
                              }
                              // console.log(currUser);
                              // res.redirect('/class/:classId');
                              res.redirect('/profile/classrooms');
                            });

                          }

                        });

                      });
          }


      }

    });

  }else{
    res.redirect('/profile/classrooms');
  }

});

module.exports = router;
