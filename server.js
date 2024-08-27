global.__basepath = process.cwd();
global.app = new require("express")();
const http = require('http');
global.express = require("express");
var logger          = require('morgan');
const bodyParser = require("body-parser");
global.mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
var {to, TE} = require("./business_logic/middlewares/utilities");
let appRoutes  = require('./business_logic/routes');
// let adminUser =  require('./business_logic/service/AdminService');
const passport = require("passport");
require("./bin/kernal");
var moment  = require('moment');

/**
 * Setting Up .env
 */
dotenv.config();

app.use(logger('dev'));
app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.json({limit:"25mb"}));
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Setting Routing
 */
 
app.use("/user/api/bec", appRoutes);

app.set("port", process.env.PORT || 3000);

// Setup Connection to DB
mongoose.set("strictQuery", false);
exports.db = mongoose
    .connect(process.env.db_url,{ useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Mongo Connection Successfull"))
    .catch(err => console.error(err,"> error occurred from the database"));

app.listen(process.env.PORT, () => {
  console.log("App is running at http://localhost: %s in %s mode",process.env.PORT,process.env.NODE_ENV);
  console.log("  Press CTRL-C to stop\n");
  // adminUser.createFirstAdminAtStarting();

});


module.exports = app;