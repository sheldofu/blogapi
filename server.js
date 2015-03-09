var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(express.static('templates'));
app.use(express.static(__dirname + '/js'))

app.get('/', function(req, res){
    // res.json(blog);
res.sendfile('templates/main.html')
    // Post.find(function(err, posts) {
    //     if (err) { return next(err) }
    //     res.json(posts)
    // })
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

    //post one
    var post = new Post({
        username : 'default',
        title : req.body.title,
        body : req.body.text    
    })

    post.save(function (err, post){
        if (err) {
            return next(err)
        }
        res.json(201, post)
    })

    // res.json(true)
})


app.listen(process.env.PORT || 9202);