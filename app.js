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
const Activity=require('./models/activity');
const atlas='mongodb+srv://moli:remember@cluster0.tdxrh.mongodb.net/best?retryWrites=true&w=majority'

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

app.get('/activity',function(req,res){
    Activity.find({},function(err,activities){
        if(err){
            console.log(err);
            res.redirect('/');
        }
        else{
            res.render('activity',{activities:activities.reverse()});
        }
    });    
});

app.get('/activity/new',function(req,res){
    res.render('actnew');
});

app.post('/activity',function(req,res){
    const activity=req.body.activity;
    Activity.create(activity,function(err,obj){
        if(err){
            console.log(err);
            res.redirect('/');
        }
        else{
            res.redirect('/activity');
        }
    });
});

app.get('/publications',function(req,res){
    Pub.find({},function(err,pubs){
        if(err){
            res.redirect('/');
            console.log(err);
        }
        else{
            res.render('publications',{pubs: pubs.reverse()});
        }
    })
});

app.get('/publications/new',function(req,res){
    res.render('pubnew');
});

app.get('/publications/:id',function(req,res){
    Pub.findById(req.params.id,function(err,pub){
        if(err){
            res.redirect('/');
            console.log(err);
        }
        else{
            res.render('pub',{pub: pub});
        }
    })
});

app.post('/uploadpub',function(req,res){
    const pub=req.body.pub;

    Pub.create(pub,function(err,pub){
        if(err){
            console.log(err);
            res.redirect('/');
        }
        else{
            res.redirect('/publications');
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
    const photo=req.body.photo;

    Photo.create(photo,function(err,photo){
        if(err){
            console.log(err);
            res.redirect('/');
        }
        else{
            res.redirect('/photogallery');
        }
    })
});


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