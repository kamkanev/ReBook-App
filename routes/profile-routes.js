const router = require("express").Router();
const User = require("../models/user");

router.get('/', (req, res) => {
  if(req.user){
    
        res.render("dashboard",{
          user: req.user
        });

  }else{
    res.redirect('/');
  }
});

router.post("/edit", (req, res) => {

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
