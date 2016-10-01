require('dotenv').config();
const express      = require('express'),
      path         = require('path'),
      favicon      = require('serve-favicon'),
      logger       = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser   = require('body-parser'),
      mongoose     = require('mongoose'),
      passport     = require('passport'),
      authenticate = require('./app/authenticate'),
      compression  = require('compression')
      

mongoose.connect(process.env.MONGO_URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',  () =>{
  // we're connected!
  console.log("Connected correctly to server");
});
var app = express();
app.use(compression());
app.use((req, res, next) =>{
  res.header("Access-Control-Allow-Origin", "*");
  
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Credentials,x-access-token");
  next();
});



var port = process.env.PORT || 5000;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static( path.join(__dirname, '/bower_components')) );
app.use('/node_modules',  express.static( path.join(__dirname, '/node_modules')) );

app.use('/', require('./app/routes/index'));
app.use('/users', require('./app/routes/users'));
app.use('/checkout', require('./app/routes/checkout'));
app.use('/market', require('./app/routes/items'));
app.use('/blog', require('./app/routes/blog'));
app.use('/phrases', require('./app/routes/phrase'));
// app.use('/quizes', require('./routes/quizes'));

// catch 404 and forward to error handler
app.use((req, res, next) =>{
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next)=> {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next)=> {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port, ()=> {
    console.log(`Our app is running on http://localhost:${port}`);
});

module.exports = app;
