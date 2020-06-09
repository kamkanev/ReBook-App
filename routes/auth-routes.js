const router = require('express').Router();
//models
//passport

router.get('/login', (req, res) => {
  res.render('login')
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { fname, lname, email, password, password2 } = req.body;
  var errs = [];

  if(!fname || !lname || !email || !password || !password2){
    errs.push({
      msg: "Попълни всички полета моля!"
    });
  }

  if(password.length < 6){
    errs.push({
      msg: "Паролата е много къса, трябва да е поне 6 символа!"
    });
  }

  if(password != password2){
    errs.push({
      msg: "Паролите не съвпадат!"
    });
  }

  if(errs.length > 0){
    res.render('register', {
      fname,
      lname,
      email,
      password,
      password2,
      errs
    });
  }else{

    // var registered = true;
    //
    // res.render('dashboard', {
    //   registered
    // });
    
  }


});

module.exports = router;
