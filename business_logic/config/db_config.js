const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
module.exports.db = mongoose
    .connect(process.env.db_url,{ useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Connection Successfull"))
    .catch(err => console.error(err,"> error occurred from the database"));