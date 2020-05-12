var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var passport = require("passport");
var Strategy = require("passport-twitter").Strategy;
var session = require("express-session");
var Twit = require("twit");
var fs = require("fs");
//var cookieSession = require("cookie-session");
var MemoryStore = require("memorystore")(session);

/*
API KEY: g4DPwXTPfJXGw8U7KvEAIyccR
SECRET KEY: 63XQLkXjJaa0GroBNF8w81iG5DH9VwodhbycwV3l5urKYLaMjE
PIN: 8337217

Twitter account details:
Name: Epic Gamer
Password: epicgamer222
email: d10992675@urhen.com (Currently doesn't exist anymore)

*/

passport.use(new Strategy({
  consumerKey: "g4DPwXTPfJXGw8U7KvEAIyccR",
  consumerSecret: "63XQLkXjJaa0GroBNF8w81iG5DH9VwodhbycwV3l5urKYLaMjE",
  callbackURL: "https://build-a-block.herokuapp.com/twitter/return"
  //callbackURL: "http://localhost:3000/twitter/return"
}, function (token, tokenSecret, profile, callback) {
  //const configs = createConfigs(token, tokenSecret);

  var T = new Twit({
    consumer_key: 'g4DPwXTPfJXGw8U7KvEAIyccR',
    consumer_secret: '63XQLkXjJaa0GroBNF8w81iG5DH9VwodhbycwV3l5urKYLaMjE',
    access_token: token,
    access_token_secret: tokenSecret,
  })

  
  var b64content = fs.readFileSync("./static/img/levelScreenShot.png", {
    encoding: "base64"
  })

  T.post("media/upload", {
    media_data: b64content
  }, function (err, data, response) {
    var mediaIDStr = data.media_id_string
    var altText = "Build a Block Screenshot"
    var meta_params = {
      media_id: mediaIDStr,
      alt_text: {
        text: altText
      }
    }

    if (!err) {
      var params = {
        status: "Check out what I build with Gainesville's #GNVBuildABlock",
        media_ids: [mediaIDStr]
      }

      T.post("statuses/update", params, function (err, data, response) {
        console.log(data)
      })
    }
  })
  
  /*
  T.post('statuses/update', {
    status: "hello world from node app on heroku test"
  }, function (err, data, response) {
    console.log(data)
  })
  */

  return callback(null, profile);
}));

passport.serializeUser(function (user, callback) {
  callback(null, user);
})

passport.deserializeUser(function (obj, callback) {
  callback(null, obj);
})

const app = express();

//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

//app.use(require('morgan')('combined'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  cookie: {
    maxAge: 86400000
  },
  store: new MemoryStore({
    checkPeriod: 86400000
  }),
  secret: "Build a Block",
  resave: true,
  saveUninitialized: true
}))

/*
app.use(cookieSession({
  secret: "Build a Block",
  resave: true,
  saveUninitialized: true,

  //cookie options
  maxAge: 24 * 60 * 0 * 1000
}))*/
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(__dirname + "/static"));


app.get("/", function (req, res) {
  //res.render("home", {user: req.user});
  res.sendFile(path.join(__dirname + "/static/index.html"));
})

app.get("/testRoute", function (req, res) {
  res.sendFile(path.join(__dirname + "/static/test.html"));
})

app.get("/loggedOut", function(req, res) {
  res.sendFile(path.join(__dirname + "/static/loggedOut.html"));
})

app.get('/callback',
  function (req, res) {
    //console.log('ENV');
    //console.log(process.env);
    //console.log('Headers:');
    //console.log(req.headers)
    //res.render('login');
    res.sendFile(path.join(__dirname +  "/static/callback.html"));
  });

app.get('/twitter/login', passport.authenticate('twitter'))

app.get('/twitter/return', passport.authenticate('twitter', {
  failureRedirect: '/'
}), function (req, res) {
  res.redirect('/callback')
})

app.get("/logout", function(req, res) {
  req.logout();
  res.clearCookie("Build a Block");
  res.redirect("/loggedOut");
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Running at port 3000");
});
