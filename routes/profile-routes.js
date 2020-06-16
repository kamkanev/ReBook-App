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

module.exports = router;
