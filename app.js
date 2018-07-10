var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy  = require("passport-local"),
    Products    = require("./models/products"),
    User        = require("./models/user"),
    moment      = require('moment');
    
mongoose.connect("mongodb://localhost/products");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//Passport
app.use(require("express-session")({
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
    next();
});

//ROUTES
app.get("/", function(req, res){
   res.render("landing"); 
});

//INDEX - show all products
app.get("/products", function(req, res){
    Products.find({}, function(err, allProducts){
        if(err){
            console.log(err);
        } else {
            // console.log(req.user);
            res.render("products",{products: allProducts, currentUser: req.user});
        }
    });
});

//NEW Product
app.get("/products/new", function(req, res) {
    res.render("new");
});

//Show
app.get("/products/:id", function(req, res){
    Products.findById(req.params.id, function(err, foundproduct){
      if(err){
          console.log(err);
      } else {
        //   console.log(foundproduct);
          res.render("show", {product: foundproduct});
        // res.send("gotcha0");
      }
    }); 
});

//Category
app.get("/products/:category/view", function(req, res){
    Products.find({"category": req.params.category}, function(err, allProducts){
        if(err){
            console.log(err);
        } else {
            // console.log(allProducts);
            res.render("products",{products: allProducts});
        }
    });
});


//NEW POST
app.post("/products", function(req, res){
    Products.create(req.body.product, function(err, product){
       if(err){
           console.log(err);
       } else {
           res.redirect("/products");
       }
    });
});

//DELETE
app.delete("/products/:id", function(req, res){
  Products.findByIdAndRemove(req.params.id, function(err, foundproduct){
      if(err){
          console.log(err);
      } else {
          console.log("almost done");
          res.redirect("/products");
      }
  }); 
});

//Cart
app.get("/products/:id/cart", function(req, res) {
    Products.findById(req.params.id, function(err, buying){
       if(err){
           console.log(err);
       } else {
           var total=+buying.price;
           console.log(total);
           res.render("cart", {product: buying});
       }
    });
});

//Details
app.get("/products/:id/details", function(req, res) {
    Products.findById(req.params.id, function(err, buying){
       if(err){
           console.log(err);
       } else {
           res.render("details", {product: buying});
       }
    });
});

app.post("/products/:id/details", function(req, res) {
    Products.findById(req.params.id, function(err, buying){
        if(err){
            console.log(err);
        } else {
            var alldetails = req.body.details;
            var moment = require('moment');
            console.log(moment().format('Do YYYY-MM-DDTHH:mm:ss'));
            res.render("billsummary", {details: alldetails, product: buying, moment: moment});
        }
    });
});

//*************************
//AUTH Routes
//*************************

app.get("/register", function(req, res){
   res.render("register"); 
});

app.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render("register");
      } 
      passport.authenticate("local")(req, res, function(){
         res.redirect("/products"); 
      });
    //   console.log(user);
   });
});

app.get("/contactus", function(req, res) {
   res.render("contactus"); 
});

//LOGIN Routes
app.get("/login", function(req, res){
   res.render("login"); 
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/products",
        failureRedirect: "/login"
    }) ,function(req, res){
    
});

//Logout
app.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/products");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Revision Project is on the way");
});