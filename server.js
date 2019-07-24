var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");


var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

// Serve static content for the app from the "public" directory in the application directory.

app.use(express.static("public"));


// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars.
var exphbs = require("express-handlebars");
// app.set('views', path.join(__dirname, 'public/views'))
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

var routes = require("./routes/api");

app.use(routes);



// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

module.exports = app;