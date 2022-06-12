/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: ____Joshua Chong________ Student ID: _11437620___ Date: __1/20/2022____
* Heroku Link: ____https://immense-sea-64619.herokuapp.com/___________
*
********************************************************************************/ 

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Load the dotenv module and have it read your .env file
require('dotenv').config()
// Obtain the value of the MONGODB_CONN_STRING from the environment
const { MONGODB_CONN_STRING } = process.env;

const app = express();
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB();

const HTTP_PORT = process.env.PORT || 8080;
 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// call this function after the http server starts listening for requests
// function onHttpStart() {
//   console.log("Express http server listening on: " + HTTP_PORT);
// }

// root route
app.get("/", (req, res) => {
  res.json({message: "Web422 Restaurant API"})
});

// add new restaurant
app.post("/api/restaurants", function(req,res){
  db.addNewRestaurant(req.body).then((result) => {
      //if creation is a sucess, return the json or return a sucess message
      //res.status(201).json(result);
      if (result){
        res.status(201).json({message: "Restaurant created"});
      }
      
  }).catch((err) => {
      //if creation failed, return a error message
      //res.status(500).json({message: err});
      res.status(500).json({message: "Unable to create restaurant"});
  })
});

// search for restaurants
app.get("/api/restaurants", function(req,res){
  db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough).then((result) => {
    if (result.length > 0){
      //assuming there will be a contant/component named restaurant 
      //res.status(201).render("restaurants", { restaurants: result });
      res.status(201).json(result);
    }else{
      res.status(201).json({message: "No restaurant found"});
    }
  }).catch((err) => {
    //if search failed, return a error message
    //res.status(500).json({message: err});
    res.status(500).json({message: "Unable to search for restaurants"});
  })
});

// get restaurant by id
app.get("/api/restaurants/:_id", function(req,res){
  db.getRestaurantById(req.params._id).then((result) => {
      //return a restaurant object to the client
      //res.status(201).json(result);
      if (result != null){
        res.status(201).json(result);
      }
      else{
        res.status(201).json({message: "No restaurant found"});
      }
      
  }).catch((err) => {
      //if creation failed, return a error message
      //res.status(500).json({message: err});
      res.status(500).json({message: "Unable to search restaurant" + req.params._id});
  })
});

//update a restaurant
app.put("/api/restaurants/:_id", function(req,res){
  db.updateRestaurantById(req.body, req.params._id).then((result) => {
      //return a restaurant object to the client
      //res.status(201).json(result);
        res.status(201).json({message: "Restaurant " + req.params._id + " has been updated" });
      
  }).catch((err) => {
      //if creation failed, return a error message
      //res.status(500).json({message: err});
      res.status(500).json({message: "Unable to update restaurant " + req.params._id});
  })
});

//delete a restaurant
app.delete("/api/restaurants/:_id", function(req,res){
  db.deleteRestaurantById(req.params._id).then((result) => {
      //return a restaurant object to the client
      res.status(201).json({message: "Restaurant " + req.params._id + " has been deleted." });
      //res.status(204).json({message: "Restaurant " + req.params._id + " has been deleted." });
      
  }).catch((err) => {
      //if creation failed, return a error message
      //res.status(500).json({message: err});
      res.status(500).json({message: "Unable to detele restaurant " + req.params._id});
  })
});

// setup http server to listen on HTTP_PORT
//app.listen(HTTP_PORT, onHttpStart);

db.initialize(MONGODB_CONN_STRING).then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("app listening on: " + HTTP_PORT);
    });
}).catch(function(err){
    console.log("unable to start server: " + err);
});