/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ranveer Singh Saini Student ID: 134213206 Date: 2022-01-21
*  Heroku Link: https://web422-ranveer-assignment.herokuapp.com/
*
********************************************************************************/ 
//Setting MiddleWares
var path = require("path");
var express = require("express");
var cors = require("cors");
var dotenv =  require("dotenv");
dotenv.config({path: "./keys/keys.env"});

var app = express();
app.use(cors());
app.use(express.json());

// Importing
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB();

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
  res.json({message: "API Listening"});
});

// Status 500 for wrong URL
app.use(function(err,req,res,next){
    console.error(err.stack)
    res.status(500).send("Something Broke!")
    });

app.get("/api/restaurants", function(req,res){
    db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
    .then(allRestaurants=>{
        if(allRestaurants){
            res.status(200).json(allRestaurants);
        }
        else{
            res.status(200).json({message: "Not Found"});
        };
    })
    .catch(err=>{
        res.status(400).json(err);
    });
});

app.post("/api/restaurants", function(req,res){
    db.addNewRestaurant(req.body)
    .then(newRestaurant=>{
        if(newRestaurant){
            res.status(200).json({message: "Success"});
        }
        else{
            res.status(200).json({message: "Fail"});
        };
    })
    .catch(err=>{
        res.status(400).json(err);
    });
})

app.get("/api/restaurants/:id", function(req,res){
   db.getRestaurantById(req.params.id)
   .then(getRestaurant=>{
       if(getRestaurant){
       res.status(200).json(getRestaurant);
       }
       else{
           res.status(200).json({message: "Not Found"});
       };
   })
   .catch(err=>{
       res.status(400).json(err);
   });
});

app.put("/api/restaurants/:id", function(req,res){
    db.updateRestaurantById(req.body, req.params.id)
    .then(updateRestaurant=>{
        if(updateRestaurant != db.getRestaurantById(req.params.id)){
            res.status(200).json({message: "Success"});
        }
        else{
            res.status(200).json({message: "Fail"});
        };
    })
    .catch(err=>{
        res.status(400).json(err);
    });
 });

 app.delete("/api/restaurants/:id", function(req,res){
    db.deleteRestaurantById(req.params.id)
    .then(deleteRestaurant=>{
        if(deleteRestaurant){
            res.status(200).json({message: "Fail"});
        }
        else{
            res.status(200).json({message: "Success"});
        };
    })
    .catch(err=>{
        res.status(400).json(err);
    });
 });

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
db.initialize(process.env.CONNECTION_STRING)
.then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});