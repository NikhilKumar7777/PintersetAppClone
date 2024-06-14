var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postsModel = require('./posts');
const passport = require('passport');
const LocalStrategy = require('passport-local');
passport.use(new LocalStrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/createUser', async function(req, res, next) {
//  var userData = await userModel.create({
//     username: "Nikhil",
//   password: "123",
//   posts: [],
//   email: "nikhil@gmail.com",
//   fullname: "Nikhil",
//   })
//   res.send(userData);
// });

// router.get('/createPost', async function(req, res, next) {
//   var postData = await postsModel.create({
//     posttext: "Hello world Jai Shree Ram !!",
//     user : "666c82a529f9464065935908",
//    });
//    var user = await userModel.findOne({_id: "666c82a529f9464065935908"});
//    user.posts.push(postData._id);
//    await user.save();

//    res.send("Done!");
//  });

//  router.get('/getPosts', async function(req, res, next) {
//   var posts = await userModel.findOne({_id: "666c82a529f9464065935908"}).populate("posts");
//   res.send(posts);
//  });


router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('profile');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});


router.get('/feed', function(req, res, next) {
  res.render('feed');
});


router.post('/register', async function(req, res) {
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
  });
  await userModel.register(userData, req.body.password).then(function(){
    passport.authenticate("local")(req, res,function(){
      res.redirect("/profile");
    })

  });
})

router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
}));

router.get('/logout', function(req, res){
  req.logout(function(err){
    if (err) { return next(err); }
      res.redirect("/");
  });
});

function isLoggedIn(req, res ,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}

module.exports = router;
