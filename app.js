var express     = require("express"),
    app         = express(),
    flash       = require('connect-flash'),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    methodOverride = require("method-override"),
    expressValidator = require("express-validator"),
    LocalStrategy  = require("passport-local"),
    Products    = require("./models/products"),
    User        = require("./models/user"),
    moment      = require('moment'),
    session     = require('express-session');
    
app.use(expressValidator());
var authRoute = require('./routes/auth');
var indexRoutes = require('./routes/index');

// mongoose.connect("mongodb://localhost/products", { useNewUrlParser: true });
mongoose.connect("mongodb://believepranay:database1@ds233061.mlab.com:33061/univercell", { useNewUrlParser: true });
// mongoexport -h ds233061.mlab.com:33061 -d univercell -c <collection> -u <user> -p <password> -o <output file>
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

//Passport
app.use(session({
    secret: "missing college badly!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;  // this statement assigns loggedin user(req.user) to currentUsers which is accessible in each tempelate
    res.locals.loginError = req.flash('error')
    res.locals.loginSuccess = req.flash('success');
    next();
});

app.get("/", function(req, res){
    res.render("landing"); 
 });

 app.get("/load", (req, res) => {
    res.render("landing2")
 });

app.use('/', authRoute);
app.use('/products', indexRoutes);

function isLoggedin(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
  }

app.listen(8080 , function(){
   console.log("Revision Project is on the way");
});