const passport       = require("passport");
require('./passport');
module.exports = function (req, res, next) {

    passport.authenticate('jwt', function (err, user) {

        if(err) return res.status(500).json(err);
        if (!user) return res.status(401).json({error:"unauthorized request.!"});
        req.user = user;
        next();

    })(req, res, next);

};
