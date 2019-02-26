// - Importing Dependencies - \\
const express = require('express'),
      app = express(),
      path = require('path'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');

// - MongoDB Setup - \\
mongoose.connect('mongodb://localhost/blog_app_v1');
// - View Engine Setup - \\
app.set('view engine', 'ejs');
// - Static Files - \\
app.use(express.static(`${__dirname}/../../dist`));
// - Body Parser Setup - \\
app.use(bodyParser.urlencoded({extended: true}));

// * ------------ * \\
//   - DB Schema -
// * ------------ * \\
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { 
        type: Date,
        default: Date.now
     }
});
// - Converting Schema to a model - \\
const Blog = mongoose.model('Blog', blogSchema);
/*
Blog.create({
    title: 'Test Blog',
    image: 'https://images.pexels.com/photos/1232594/pexels-photo-1232594.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    body: 'Test Blog for testing purposes only.',
});*/

// * ------------ * \\
//    - ROUTES -
// * ------------ * \\

// - GET - Landing Page TBA | Landing app page
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

// - GET - Blogs Page - INDEX | Displaying all blogs
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (!err) {
            res.status(200);
            res.render((`${__dirname}/../../dist/html/index.ejs`), {blogs: blogs}); // --change to dist html when ready!
        } else {
            throw new Error(err);
        }
    });
});

// - GET - Create new Blog Page - NEW | Creating new blog page
app.get('/blogs/new', (req, res) => {
    res.status(200);
    res.render(path.resolve(`${__dirname}/../../dist/html/new-blog.ejs`));
});

// - POST - Create new Blog  - | Creating new blog
app.post('/blogs', (req, res) => {
    // Create Blog
    const dataBody = req.body.blog;
    Blog.create(dataBody, (err, newBlog) => {
        if (!err) {
            // Redirect to index
            res.redirect('/blogs');
        } else {
            throw new Error(err);
        }
    });
});


// - Setting The Port | Listening - \\
const port = 3000;
app.listen(port, () => console.log(`Server running on port - ${port}`));