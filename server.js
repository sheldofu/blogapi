var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var blog = [
    { 
        "title" : "Posty One", 
        "text" : "Hello!" 
    },
    {
        "title" : "Posty Two", 
        "text" : "More stuffufufufuf" 
    },
    {
        "title" : "Posty Three", 
        "text" : "A third - but hopefully not final - post" 
    }
]

app.get('/', function(req, res){
    res.json(blog);
});

app.get('/blog/random', function(req, res){
    var id = Math.floor(Math.random() * blog.length);
    var post = blog[id];
    res.json(post);
});

app.get('/blog:id', function(req, res){
    if (req.params.id > blog.length) {
        return res.send('Error, blog post does not exist');
    }
    var post = blog[req.params.id];
    res.json(post)
});

app.post('/blog', function(req,res) {
    if(!req.body.hasOwnProperty('title') || !req.body.hasOwnProperty('text')) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect');
    }

    var newPost = {
        title : req.body.title,
        text : req.body.text
    }

    quotes.push(newPost);
    res.json(true)
})

app.listen(9202);