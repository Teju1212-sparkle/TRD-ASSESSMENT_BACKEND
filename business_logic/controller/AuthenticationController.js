const authService = require('../service/AuthenticationService');
const {to,TE,ReE,ReS} = require('../middlewares/utilities');
const user = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
module.exports ={
    authentication: async (req, res)=>{
        let userDetails, json, token;
        let payload = req.body;
        [error, userDetails] = await to(authService.authentication(payload));
        if(error) return res.status(401).json({"status": 401,"success": false,"message": error.message});
        if(userDetails._id != null){
            bcrypt.compare(payload.password, userDetails.password,(err, match)=> {
                if (err) TE(err);
                if (match) {
                    json = userDetails.toJSON();
                    token = "Bearer " + jwt.sign(json, process.env.jwt_secret, { expiresIn: process.env.jwt_expires });
                    json = { 'user':userDetails, "token": token };
                    return ReS(res, json, 200);
                }
                if(!match){
                   return res.status(401).json({"status": 400,"success": false,"message": "Invalid password! please try again.."}); 
                }
            });
        }else{
            return res.status(401).json({"status": 401,"success": false,"message": "Cannot authenticate. Try again!"}); 
        }
    }
}