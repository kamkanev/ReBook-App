const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetUp = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');

const app = express();
const port = process.env.PORT || 1025;

//set up view engine
app.set('view engine', 'ejs');


app.use('/img', express.static(__dirname + '/img'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/fonts', express.static(__dirname + '/fonts'));

//cookieKey
app.use(cookieSession({
	maxAge: 7 * 24 * 60 * 60 * 1000,
	keys: [keys.cookie.secret]
}));

//init passport

app.use(passport.initialize());
app.use(passport.session());

//connect to db
mongoose.connect(keys.mongodb.dbURI, {
	useCreateIndex: true,
	  useNewUrlParser: true
});
let db = mongoose.connection;

db.once('open', function(){
	console.log('Connected to MongoDB');
});

//set up body parser
app.use(express.urlencoded({ extended: false }))

//set up Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

//create home
app.get('/', (req, res) => {

  if(req.user){
    res.redirect("/profile/");
  }else{
    res.render("home");
  }
});

app.listen(port, ()=>{
  console.log(`Server started on port ${port}`);
    console.log(`http://localhost:${port}`);
  //console.log(authRoutes);
});
