var express = require("express");
var router = express.Router();
var Products = require('../models/products')
var Cart = require('../models/cart')

 //INDEX - show all products
 router.get("/", function(req, res){
     Products.find({}, function(err, allProducts){
         if(err){
             console.log(err);
         } else {
             res.render("products",{products: allProducts, currentUser: req.user});
         }
     });
 });
 
 //NEW Product
 router.get("/new", function(req, res) {
     res.render("new");
 });
 
 //Show
 router.get("/:id", function(req, res){
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
 router.get("/:category/view", function(req, res){
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
 router.post("/", function(req, res){
     Products.create(req.body.product, function(err, product){
        if(err){
            console.log(err);
        } else {
            res.redirect("/products");
        }
     });
 });
 
 //DELETE
 router.delete("/:id", function(req, res){
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
 router.get("/:id/cart", function(req, res) {
     Products.findById(req.params.id, function(err, buying){
        if(err){
            console.log(err);
        } else {
            if(!req.session.cart){
                req.session.cart = [];
                req.session.cart.push(buying);
                // console.log("inside if", req.session.cart);
                
            } else {
                req.session.cart.push(buying);
                // console.log("inside else", req.session.cart);
            }
            var cart = new Cart(req.session.cart);
            res.render("cart", {product: buying});
        }
     });
 });
 
 //Details
 router.get("/:id/details",isLoggedin, function(req, res) {
     Products.findById(req.params.id, function(err, buying){
        if(err){
            console.log(err);
        } else {
            res.render("details", {product: buying});
        }
     });
 });
 
 router.post("/:id/details",isLoggedin ,function(req, res) {
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
 //********************************************************************************************************** */



 //********************************************************************************************************** */

 function isLoggedin(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
  }

 module.exports = router;