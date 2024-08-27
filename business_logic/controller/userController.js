const userService = require('../service/userService');
const {to} = require('../middlewares/utilities');
module.exports = {
    createUser : async(req, res)=>{
        let error,userDetails;
        let payload = req.body;
        [error, userDetails] = await to(userService.createUser(payload));
        if(error) return res.status(500).json({"status": 500,"success": false,"message": error.message});
        if(userDetails ){
            return res.status(200).json({"status": 201,"success": true,"data": userDetails});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot register user. Try again!"});
        }
    },
   
    getAllUsers : async(req, res)=>{
        let error, users;
        [error, users] = await to(userService.getAllUsers(req.user,req.query));
        if(error) return res.status(500).json({"status": 500,"success": false,"message": error.message});
        if(users){
            return res.status(200).json({"status": 200,"success": true,"data": users});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot get users list. Try again!"});
        }
    },
 
   
}