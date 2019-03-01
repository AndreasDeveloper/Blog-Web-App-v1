// - Importing Dependencies - \\
const express = require('express'),
      app = express(),
      path = require('path'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      methodOverride = require('method-override'),
      expressSanitizer = require('express-sanitizer');

// - MongoDB Setup - \\
mongoose.connect('mongodb://localhost/blog_app_v1');
// - View Engine Setup - \\
app.set('view engine', 'ejs');
// - Static Files - \\
app.use(express.static(`${__dirname}/../../dist`));
// - Body Parser Setup - \\
app.use(bodyParser.urlencoded({extended: true}));
// - Method Override Setup - \\
app.use(methodOverride('_method'));
// - Express Sanitizer Setup - \\
app.use(expressSanitizer());

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
    req.body.blog.body = req.sanitize(req.body.blog.body);
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

// - GET - Blog Full Page - | Showing full specific blog content
app.get('/blogs/:id', (req, res) => {
    const blogID = req.params.id;
    Blog.findById(blogID, (err, blogContent) => {
        if (!err) {
            res.render((`${__dirname}/../../dist/html/show-blog.ejs`), { blog: blogContent });
        } else {
            throw new Error(err);
        }
    });
}); 

// - GET - Edit Blog - | Edit posted blog page
app.get('/blogs/:id/edit', (req, res) => {
    const blogID = req.params.id;
    Blog.findById(blogID, (err, idFoundBlog) => {
        if (!err) {
            res.render((`${__dirname}/../../dist/html/edit-blog.ejs`), { blog: idFoundBlog });
        } else {
            throw new Error(err);
        }
    });
});

// - PUT - Updating Blog - | Update posted blog
app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    const blogID = req.params.id,
          blogData = req.body.blog;
    // Update Blog
    Blog.findByIdAndUpdate(blogID, blogData, (err, updateBlog) => {
        if (!err) {
            res.redirect(`/blogs/${blogID}`);
        } else {
            throw new Error(err);
        }
    });
});

// - DELETE - Deleting Blog - | Delete the posted blog
app.delete('/blogs/:id', (req, res) => {
    const blogID = req.params.id;
    // Delete Blog
    Blog.findByIdAndRemove(blogID, err => {
        if (!err) {
            res.redirect('/blogs');
        } else {
            throw new Error(err);
        }
    });
});

// - Setting The Port | Listening - \\
const port = 3000;
app.listen(port, () => console.log(`Server running on port - ${port}`));