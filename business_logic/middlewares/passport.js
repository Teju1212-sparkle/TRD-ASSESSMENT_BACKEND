var passport = require("passport");
const User   = require('../model/user');
const dotenv = require('dotenv').config();
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.jwt_secret;

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {

    let err, user;
    user = await User.findOne({'_id':jwt_payload._id});
    if(err) return done(err, false);
    if(user) {
        return done(null, user);
    }else{
        return done(null, false);
    }
}));

