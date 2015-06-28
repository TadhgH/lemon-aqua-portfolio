// Required Modules
var express    = require("express");
var compress   = require("compression");
var morgan     = require("morgan");
var bodyParser = require("body-parser");
var jwt        = require("jsonwebtoken");
var mongoose   = require("mongoose");
var https      = require('https');
var http       = require('http');
var app        = express();

var port = process.env.PORT || 1337;
var User = require('./models/user');
var Projects = require('./models/projects');
var config = require('./config.js');
var MONGO_URL = config.database;
var SUPER_SECRET = config.secret;


// Connect to DB
mongoose.connect(MONGO_URL);

app.use(compress());

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/assets'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/assets/index.html');
});

var adminRoutes = express.Router();
// route to authenticate a user (POST http://localhost:8080/api/authenticate)
adminRoutes.get('/setup', function(req, res) {
  console.log("this setup");
  // create a sample user
  var nick = new User({
    name: 'Tadhg',
    password: '#slash93',
    admin: true
  });
  console.log("this nick");
  console.log(nick);
  // save the sample user
  nick.save(function(err) {
    if (err) {
      console.log("this an error");
      throw err;
    }

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

adminRoutes.post('/authenticate', function(req, res) {
  // find the user
  console.log("in");
  console.log(req.body.adminname);
  User.findOne({
    name: req.body.adminname
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      // check if user matches
      console.log("user error");
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      if (user.password != req.body.password) {
        console.log("password error");
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        console.log("auth success");
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, SUPER_SECRET, {
          expiresInMinutes: 1440 // expires in 24 hours
        });
        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});

adminRoutes.post('/save', ensureAuthorized, function(req, res) {

  console.log(req);

  var project = new Projects({
    title: req.body.title,
    github: req.body.github,
    outline: req.body.outline,
    body: req.body.body,
    tags: req.body.tags
  });

  project.save(function(err) {
    if (err) throw err;
    console.log('User saved successfully');
    res.json({ success: true });
  });

});

adminRoutes.get('/list', function(req, res) {
  Projects.find({}, function(err, projects){
    res.send(projects);
  });

});

app.get('/cms', ensureAuthorized, function(req, res) {
    console.log("heynow");

    if(req.token){
      res.json({
        verified: true
      });
    } else {
      res.json({
        verified: false
      });
    }
    /*User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.json({
                type: true,
                data: user
            });
        }
    });*/
});

function ensureAuthorized(req, res, next) {
    //console.log(req.headers["authorization"]);
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

// apply the routes to our application
app.use('/admin', adminRoutes);

var findAndRemove = function(){
  // find the user with id 4
  Projects.findOneAndRemove({ title: 'nother' }, function(err) {
    if (err) throw err;

    // we have deleted the user
    console.log('User deleted!');
  });
}

//findAndRemove();

// Start Server
app.listen(port, function() {
    console.log( "Express server listening on port " + port);
});
