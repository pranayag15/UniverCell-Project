var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require('../models/user');
var request = require("request");

router.get("/register", function(req, res){
    res.render("register", {errorMessage:[], username: '', password: ''}); 
 });
 
 router.post("/register", function(req, res){
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null){
        return res.json({"responseError" : "Please select captcha first"});
    }
    const secretKey = "6LeolHUUAAAAAMPieV4SJda594W13i9fGb37Ogn7";
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL,function(error,response,body) {
        body = JSON.parse(body);

        if(body.success !== undefined && !body.success) {
            return res.json({"responseError" : "Failed captcha verification"});
        }
        // res.json({"responseSuccess" : "Sucess"});
        req.checkBody('username', 'Enter username').notEmpty();
        req.checkBody('password', 'Enter password').notEmpty();
        
        var errors = req.validationErrors();
        if(errors){
            res.render("register", {
                username: req.body.username,
                password: req.body.password,
                errorMessage: errors
            });
            // console.log(errors);
        } else {
            var newUser = new User({username: req.body.username, password: req.body.password});
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
        }
    });
 });
 
 router.get("/contactus", function(req, res) {
     req.flash('message', "pranay is dope");
    res.render("contactus"); 
 });

 router.get("/msg", (req, res)=>{
    //  console.log(req.flash('message'));
    var msg = req.flash('message');
    console.log(msg);
     res.json(msg);
 });
 
 //LOGIN Routes
 router.get("/login", function(req, res){
    // console.log(req.flash('error'));
    console.log("*********************");
    console.log(req.flash('error'));
    res.render("login"); 
 });
 
 router.post("/login", passport.authenticate("local", 
     {
         successRedirect: "/products",
         failureRedirect: "/login",
         failureFlash: "nhi ho paya login",
         successFlash: "kya ukhaad liya login krke"
     }) ,function(req, res){
        console.log(req.flash('error'));
 });

 //Logout
 router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/products");
 });

module.exports = router;