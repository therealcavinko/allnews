var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var db = require("./model");
var PORT = process.env.PORT || 3000;
var app = express();
var logger = require('morgan');

//-------------------------------------------------------------
app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
//--------------------------------------------------------------
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));
//--------------------------------------------------------------
//copied from gitlab 
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);
//--------------------------------------------------------------
app.get("/scrape", function(req, res) {
  axios.get("https://www.espn.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("h5").each(function(i, element) {
      var result = {};
//--------------------------------------------------------------
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
//--------------------------------------------------------------
      //add article
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    res.send("Scraped");
  });
});
//---------------------------------------------------------------
app.get("/articles", function(req, res) {
    db.Article.find()
      .then(function(dbPopulate) {
        res.json(dbPopulate);
      })
      .catch(function(err) {
        res.json(err);
      });
});
//---------------------------------------------------------------
app.get("/articles/:id", function(req, res) {
  db.Article.findById(req.params.id)
  .populate("note")
  .then(function(dbPopulate) {
    res.json(dbPopulate);
  })
  .catch(function(err) {
    res.json(err);
  });
});
//-----------------------------------------------------------------
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbPopulate) {
      
      return db.Article.findOneAndUpdate({id: req.params.id}, {$push: {note: dbPopulate._id}}, {new: true});
    })
    .then(function(dbPopulate) {
      res.json(dbPopulate);
    })
    .catch(function(err) {
      res.json(err);
    });
});
//---------------------------------------------------------------
app.listen(PORT, function() {
  console.log("Running on port " + PORT);
});