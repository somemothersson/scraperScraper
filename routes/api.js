var express = require("express");
var db = require("../models");
var router = express.Router();


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models


// Routes
router.get("/", function(req,res){
    // Find all Articles
    db.Article.find({})
      .then(function(data) {
        console.log(data[0])
        var hbsObject = {
          articles: data
        };
        console.log(hbsObject)
        res.render("index", hbsObject)
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });
  router.get("/saved", function(req,res){
    // Find all Articles
   
    db.Article.find({saved:true})
      .then(function(data) {
        console.log(data[0])
        var hbsObject = {
          articles: data
        };
        console.log(hbsObject)
        res.render("saved", hbsObject)
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });
  
  
  //A GET route for scraping the echoJS website
  router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://scca-chicago.com/calendar/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
    
      // Now, we grab every h2 within an article tag, and do the following:
      $("div.summary").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });
  
  // Route for getting all Articles from the db
  router.get("/articles", function(req, res) {
    // TODO: Finish the route so it grabs all of the articles
  
    // Find all Articles
    db.Article.find({})
      .then(function(dbArticle) {
        // If all Articles are successfully found, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });
  
  router.get("/notes", function(req, res) {
    // TODO: Finish the route so it grabs all of the articles
  
    // Find all Articles
    db.Note.find({})
      .then(function(dbNote) {
        // If all Articles are successfully found, send them back to the client
        res.json(dbNote);
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  router.get("/articles/:id", function(req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    db.Article.findOne({"_id": req.params.id})
    .populate("note")
    .then(function(dbArticle) {
      // If any Libraries are found, send them to the client with any associated Books
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
  
  });
  
  //routes for saving and unsaving article
  router.put("/save/:id", function(req, res) {
    // Create a new user using req.body
  console.log(req.params.id)
    db.Article.update({_id : req.params.id},
   {$set : {saved : true}})
  
      .then(function(dbArticle) {
        // If saved successfully, send the the new User document to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send the error to the client
        res.json(err);
      });
  });
  router.put("/unsave/:id", function(req, res) {
    // Create a new user using req.body
  console.log(req.params.id)
    db.Article.update({_id : req.params.id},
   {$set : {saved : false}})
  
      .then(function(dbArticle) {
        // If saved successfully, send the the new User document to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send the error to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  router.post("/articles/:id", function(req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property  with the _id of the new note
    db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({_id:req.params.id}, { $set: { note: dbNote._id } }, { new: true });
    })
    .then(function(dbArticle) {
      // If the User was updated successfully, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
  });
  

  module.exports = router