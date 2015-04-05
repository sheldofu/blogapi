var express = require('express');
var bodyParser = require('body-parser');
var multer  = require('multer');

var app = express();
// var done=false;

// app.use(require('./auth'))
app.use('/test', require('./auth'))
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});



app.use(express.static('templates'));
app.use(express.static('uploads'));
app.use(express.static(__dirname + '/js'))

app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    return filename + Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
    // done=true;
  }
}));


app.get('/', function(req, res){
    // res.json(blog);
  res.sendfile('templates/main.html')
    // Post.find(function(err, posts) {
    //     if (err) { return next(err) }
    //     res.json(posts)
    // })
});

app.get('/test', function(req, res){
  res.sendfile('templates/test.html')
});

app.get('/blog/all', function(req, res){
    Post.find(function(err, posts) {
        if (err) { return next(err) }
        res.json(posts)
    })
});


app.get('/blog/random', function(req, res){
    var id = Math.floor(Math.random() * blog.length);
    var post = blog[id];
    res.json(post);
});


var mongoose = require('./db')

var Post = mongoose.model('Post', {
  username: { type: String, required: true },
  title:    { type: String, required: true },
  body:     { type: String, required: true },
  imgpath:  { type: String, required: true },
  date:     { type: Date,   required: true, default: Date.now }
})

var user = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true, select: false}
})

var User = mongoose.model('User', user)



app.post('/blog', function(req,res) {
    if(!req.body.hasOwnProperty('title') || !req.body.hasOwnProperty('text')) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect');
    }

  // if(done==true){
    // console.log(req.body)
    // console.log(req.files);
    // console.log(req.files.userPhoto.path);
    // // res.end("File uploaded.");
  // }

    var post = new Post({
        username : 'default',
        title : req.body.title,
        body : req.body.text,
        imgpath : req.files.userPhoto.name
    })

    console.log(post);

    post.save(function (err, post){
        if (err) {
            console.log(err);
            return next(err)
        }
        res.json(201, post)
    })

    // res.json(true)
})


// var router = require('express').Router()
var bcrypt = require('bcrypt')
var jwt    = require('jwt-simple')
// var User   = require('../../models/user')
// var config = require('../../config')

// register endpoint, make new user
app.post('/users', function (req, res, next) {
  var user = new User({username: req.body.username})
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    if (err) { return next(err) }
    user.password = hash
    user.save(function (err) {
      if (err) { return next(err) }
      res.sendStatus(201)
    })
  })
})

// returns user if token passed in
app.get('/users', function (req, res, next) {
  if (!req.headers['x-auth']) {
    return res.sendStatus(401)
  }
  var auth = jwt.decode(req.headers['x-auth'], 'asecretkey')
  User.findOne({username: auth.username}, function (err, user) {
    if (err) { return next(err) }
    res.json(user)
  })
})


// returns JWT from username/password
app.post('/sessions', function (req, res, next) {
  var username = req.body.username
  User.findOne({username: username})
  .select('password')
  .exec(function (err, user) {
    if (err) { return next(err) }
    if (!user) { return res.sendStatus(401) }
    bcrypt.compare(req.body.password, user.password, function (err, valid) {
      if (err) { return next(err) }
      if (!valid) { return res.sendStatus(401) }
      var token = jwt.encode({username: username}, 'asecretkey')
      res.send(token)
    })
  })
})

app.listen(process.env.PORT || 9202);