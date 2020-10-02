const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const methodOverride=require('method-override');
const expressSanitizer=require('express-sanitizer');
const passport=require('passport');
const localStrategy=require('passport-local');
const expressSession=require('express-session');
const Blog=require('./models/blog');
const express = require('express');
const app=express();
const User=require('./models/user');
const Photo=require('./models/photo');
const Pub=require('./models/pubs');
const multer=require('multer');
const path=require('path');
const upload=require('./uploadpic');
const upload2=require('./uploadpub');

mongoose.connect(process.env.MONGODB_URL||atlas||'mongodb://localhost/mongoose_demo',{useNewUrlParser:true,useUnifiedTopology:true});

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

app.use(expressSession({
    secret:"Manali",
    resave:false,
    saveUninitialized:false
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.use(new localStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    app.use(function(req,res,next){
        res.locals.currentUser=req.user;
        next();
});

//User.register({username:'majumdermoli2@gmail.com'},'adyashis6@puni');

const middleware=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/signin");
}

app.get('/',function(req,res){
    res.render('home');
});

app.get('/about',function(req,res){
    res.render('about');
});

app.get('/publications',function(req,res){
    Pub.find({},function(err,pubs){
        if(err){
            res.redirect('/');
            console.log(err);
        }
        else{
            res.render('publications',{pubs: pubs});
        }
    })
});

app.get('/publications/new',function(req,res){
    res.render('pubnew');
});

app.post('/uploadpub',function(req,res){
    upload2(req, res,(error) => {
        if(error){
           res.redirect('/');
           throw(error);
        }else{
          if(req.file == undefined){
            
            res.redirect('/');
            console.log('File size too large');  
          }else{
               
              /**
               * Create new record in mongoDB
               */
              var fullPath = "pubs/"+req.file.filename;
  
              var document = {
                path:     fullPath, 
                title:   req.body.title
              };
    
            var pub = new Pub(document); 
            pub.save(function(error){
              if(error){ 
                throw error;
              } 
              res.redirect('/publications');
           });
        }
      }
    });
});

app.get('/contact',function(req,res){
    res.render('contact');
});

app.get('/photogallery',function(req,res){
    Photo.find({},function(err,photos){
        if(err){
            res.redirect('/');
            console.log(err);
        }
        else{
            res.render('photo_gallery',{photos: photos.reverse()});
        }
    })
});

app.post('/uploadpic',function(req,res){
    upload(req, res,(error) => {
        if(error){
           res.redirect('/');
           throw(error);
        }else{
          if(req.file == undefined){
            
            res.redirect('/');
            console.log('File size too large');  
          }else{
               
              /**
               * Create new record in mongoDB
               */
              var fullPath = "pics/"+req.file.filename;
  
              var document = {
                path:     fullPath, 
                caption:   req.body.caption
              };
    
            var photo = new Photo(document); 
            photo.save(function(error){
              if(error){ 
                throw error;
              } 
              res.redirect('/photogallery');
           });
        }
      }
    });
})

app.get('/photogallery/new',function(req,res){
    res.render('photonew');
});

app.get('/blogs',function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            res.redirect('/');
        }
        else{
            res.render('blogpage',{blogs:blogs.reverse()});
        }
    });
});

app.get('/blogs/new',middleware,function(req,res){
    res.render('new');
});

app.get('/blogs/:id',function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            res.redirect('/blogs');
        }
        else{
            res.render('show',{blog:blog});
        }
    });
});

app.get('/blogs/:id/edit',middleware,function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            res.redirect('/blogs');
        }
        else{
            res.render('edit',{blog:blog});
        }
    });
});

app.post('/blogs',function(req,res){
    const blog=req.body.blog;
    blog.body=req.sanitize(blog.body);
    Blog.create(blog,function(err,blog){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/blogs/'+blog._id);
        }
    })
});

app.put('/blogs/:id',function(req,res){
    const blog=req.body.blog;
    blog.body=req.sanitize(blog.body);
    Blog.findByIdAndUpdate(req.params.id,blog,function(err,ublog){
        if(err){
            res.redirect('/blogs')
            console.log(err);
        }
        else{
            res.redirect('/blogs/'+ublog._id);
        }
    })
});

app.delete('/blogs/:id',middleware,function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
            res.redirect('/blogs');
        }
        else{
            res.redirect('/blogs');
        }
    })
});

app.get('/signin',function(req,res){
    res.render('signin');
});

app.post('/signin',
    passport.authenticate("local",{
        successRedirect:"/blogs",
        failureRedirect:"/signin"
}));

app.get('/signout',function(req,res){
    req.logout();
    res.redirect("/");
})


app.listen(process.env.PORT||3000, process.env.IP, function(){
    console.log("Server is listening");
});