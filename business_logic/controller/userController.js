const userService = require('../service/userService');
const {to} = require('../middlewares/utilities');
module.exports = {
    createUser : async(req, res)=>{
        let userDetails;
        let payload = req.body;
        console.log(payload)
        [error, userDetails] = await to(userService.createUser(payload));
        if(error) return res.status(500).json({"status": 500,"success": false,"message": error.message});
        if(userDetails && userDetails!==false){
            return res.status(200).json({"status": 201,"success": true,"data": userDetails});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot add user. Try again!"});
        }
    },
    updateUser : async(req, res)=>{
        let userDetails;
        let payload = req.body;
        let userId = req.params.userId;
        [error, userDetails] = await to(userService.updateUser(userId,payload));
        if(error) return res.status(500).json({"status": 500,"success": false,"message": error.message});
        if(userDetails && userDetails!==false){
            return res.status(200).json({"status": 200,"success": true,"data": userDetails});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot update user. Try again!"});
        }
    },
    getAllUsers : async(req, res)=>{
        let error, users;
        [error, users] = await to(userService.getAllUsers(req.user,req.query));
        if(error) return res.status(500).json({"status": 500,"success": false,"message": error.message});
        if(users && users!==false){
            return res.status(200).json({"status": 200,"success": true,"data": users});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot get users list. Try again!"});
        }
    },
    userDropdown : async(req, res)=>{
        let error, users;
        [error, users] = await to(userService.userDropdown(req.query));
        if(error) return res.status(500).json({"status": 500,"success": false,"message": error.message});
        if(users && users!==false){
            return res.status(200).json({"status": 200,"success": true,"data": users});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot get users list. Try again!"});
        }
    },
    displayUserById:async(req, res)=>{
        let error, users;
        [error, users] = await to(userService.displayUserById(req.params.userId));
        if(error) return res.status(500).json({"status": 500,"success": false,"message": error.message});
        if(users && users!==false){
            return res.status(200).json({"status": 200,"success": true,"data": users});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot get user info. Try again!"});
        }
    },
    displayUserByCounselorId:async(req, res)=>{
        let error, users;
        [error, users] = await to(userService.displayUserByCounselorId(req.params.id));
        if(error) return res.status(500).json({"status": 500,"success": false,"message": error.message});
        if(users && users!==false){
            return res.status(200).json({"status": 200,"success": true,"data": users});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot get user info. Try again!"});
        }
    },
    deleteUserById:async(req, res)=>{
        let error, users;
        [error, users] = await to(userService.deleteUserById(req.params.userId));
        if(error) return res.status(500).json({"status": 500,"success": false,"message": error.message});
        if(users && users!==false){
            return res.status(200).json({"status": 200,"success": true,"data": users});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot delete user. Try again!"});
        }
    },
    usersFilters : async(req, res)=>{
        let error, users;
        [error, users] = await to(userService.usersFilters(req.user,req.query,req.body));
        if(error) return res.status(500).json({"status": 500,"success": false,"message": error.message});
        if(users && users!==false){
            return res.status(200).json({"status": 200,"success": true,"data": users});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot get users list. Try again!"});
        }
    },
    addRedeemPoints : async(req, res)=>{
        let userDetails, error;
        [error, userDetails] = await to(userService.addRedeemPoints(req.body, req.params.counselorId));
        if(error) return res.status(500).json({"status": 500,"success": false,"message": error.message});
        if(userDetails && userDetails!==false){
            return res.status(200).json({"status": 201,"success": true,"data": userDetails});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot add user. Try again!"});
        }
    },
    getAllCounselorRedeemHistory : async(req, res)=>{
        let error, users;
        [error, users] = await to(userService.getAllRedeemHistory(req.params.counselorId, req.query));
        if(error) return res.status(500).json({"status": 500,"success": false,"message": error.message});
        if(users && users!==false){
            return res.status(200).json({"status": 200,"success": true,"data": users});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot get users list. Try again!"});
        }
    },
    displayUserServicePointsByCounselorId:async(req, res)=>{
        let error, users;
        [error, users] = await to(userService.displayUserServicePointsByCounselorId(req.params.id,req.params.collegeId,req.params.courseId,req.params.districtType));
        if(error) return res.status(500).json({"status": 500,"success": false,"message": error.message});
        if(users && users!==false){
            return res.status(200).json({"status": 200,"success": true,"data": users});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot get user info. Try again!"});
        }
    },
    updateUserPassword : async(req, res)=>{
        let userDetails;
        let payload = req.body;
        let userId = req.params.userId;
        [error, userDetails] = await to(userService.changeUserPassword(userId,payload));
        if(error) return res.status(500).json({"status": 500,"success": false,"message": error.message});
        if(userDetails && userDetails!==false){
            return res.status(200).json({"status": 200,"success": true,"data": userDetails});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot update user. Try again!"});
        }
    },
}