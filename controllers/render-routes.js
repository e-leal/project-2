const sequelize = require('../config/connection');
const router = require('express').Router();
const db = require("../models")
const { Router } = require("express");
const { precompile } = require('handlebars');
const withAuth = require('../utils/auth.js');

router.get("/", (req, res) => {
    res.render("login")
})

router.get("/images", (req, res) => {
    db.Product.findAll({}).then(image => {
        res.render("images", {images: image})
    })
})

router.get("/new-product", (req, res) => {
    res.render("index")
})

router.get("/products", (req, res) => {
    db.Product.findAll({
        attributes: [
            'product_name',
            'description',
            'price',
            'condition',
            'location',
            'image',
            'user_id',
            [sequelize.literal('(SELECT username FROM user WHERE product.user_id = user.id)'), 'user']
        ]
          
        
    }).then(products => {
        res.render("products", {products})
    })
})

router.get("/product/:id", (req, res) => {
    db.Product.findOne({
        where: {
            id: req.params.id
          },
        attributes: [
            'product_name',
            'description',
            'price',
            'condition',
            'location',
            'image',
            [sequelize.literal('(SELECT username FROM user WHERE product.user_id = user.id)'), 'user']
        ]
          
        
    }).then(product => {
        res.render("single-product", {product})
    })
})

router.get("/seller/:id", (req, res)=>{
    db.Rating.findOne({
        where: {
            id: req.params.id
          },
        attributes: [
            'rated_by',
            'rating_value',
            //'user_id',
            [sequelize.literal('(SELECT username FROM user WHERE rating.user_id = user.id)'), 'user']
            //[sequelize.literal('(SELECT AVG(rating_value) FROM rating WHERE rating.rated_by = user.id)'), 'rating_avg']
        ]
    })
    .then(ratings => {
        res.render("seller", {ratings})
    })
})

router.get('/rating/:id', (req, res) => {
    console.log("About to rate a user!\n");
  
    if(req.session){
      console.log("About to rate a user!....again\n");
      console.log("our rater is: ",req.session.user_id);
      console.log("our user being rated is: ", req.params.id);
      console.log("our selected rating value is: ", req.body.rating_value);
      db.Rating.findAll(
         {
            rated_by: req.session.user_id,
            user_id: req.params.id,
            rating_value: req.body.rating_value
          }
      )
      .then(updatedRatingData => {
        if (!updatedRatingData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(updatedRatingData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err); 
      });
    }
  });

router.get("/homepage", (req, res) =>{
    res.render("index2");
})
router.get('/login', (req, res) => {
 //   if (req.session.loggedIn) {
  //  res.redirect('/');
    //return;
   // }
  
    res.render('login');
  });

module.exports = router