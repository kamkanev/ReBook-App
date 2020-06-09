const express = require('express');

const authRoutes = require('./routes/auth-routes');

const app = express();
const PORT = process.env.PORT || 1025;

//set view engine
app.set('view engine', 'ejs');

//access file from these folder
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));

//set up body parser
app.use(express.urlencoded({ extended: false }))

//set up routes
app.use('/auth', authRoutes);

//create home
app.get('/', (req, res) => {

  res.render('home');

});

//load server on port
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
