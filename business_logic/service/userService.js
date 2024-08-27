'use strict'
const Users = require('../model/user');
const {to,TE} =  require('../middlewares/utilities');
const PointStructure = require('../model/PointStructure');
module.exports={
    createUser : async(payload)=>{
        let error,duplicateData, newUser;
        
        [error, duplicateData] = await to(Users.find({email:payload.email}));
        if(duplicateData.length>0){
            {TE("User already exists with this email.!");}
        }
        if(error) {TE(error, true)};
      
        [error,newUser] = await to(newUser.save());
        if (error) {
            TE(error.message, true);
        }    
        return newUser? {newUser}:false;
    },
    getAllUsers : async(user,query)=>{
        let error, usersList,roleData,obj,filter={};
        // [error,roleData] = await to(UserRoles.find({"_id": user.role},{"users":1}));
        // if(error) {TE(error, true);}
        // if(roleData){
        //     obj = roleData[0].users;
        // };
        let options = {
            sort: { createdAt: -1 },
            lean: true,
            page: query.page? query.page:1,
            limit: query.limit? query.limit:10
        };
        if(query.type){
            filter.accessLevel = query.type;
        }
        if(user.accessLevel == 'counselor'){
            filter.createdBy=new mongoose.Types.ObjectId(user._id);
        }
        let userAggregate = Users.aggregate([
            {
                $match:filter
            },{
                $lookup:{
                    from:"user_roles",
                    localField:"role",
                    foreignField:"_id",
                    as:"role"
                }
            },{
                $unwind:{ 'path': '$role', 'preserveNullAndEmptyArrays': true }
            },{
                $lookup:{
                    from:"Users",
                    localField:"createdBy",
                    foreignField:"_id",
                    as:"createdBy"
                }
            },{
                $unwind:{ 'path': '$createdBy', 'preserveNullAndEmptyArrays': true }
            },{
                $lookup:{
                    from:"State",
                    localField:"state",
                    foreignField:"_id",
                    as:"state"
                }
            },{
                $unwind:{ 'path': '$state', 'preserveNullAndEmptyArrays': true }
            },{
                $lookup:{
                    from:"districts",
                    localField:"adharDistrict",
                    foreignField:"_id",
                    as:"adharDistrict"
                }
            },{
                $unwind:{ 'path': '$adharDistrict', 'preserveNullAndEmptyArrays': true }
            },{
                $project:{
                    "role._id":1,"role.roleName":1,
                    "_id":1,"email":1,"fullName":1,
                    "phone":1,"accessLevel":1,"status":1,"state._id":1,"state.state":1,"adharDistrict._id":1,"adharDistrict.district":1,
                    "createdBy._id":1,"createdBy.fullName":1,"createdAt":1,"updatedAt":1,"counselor_id": 1
                }
            }
        ]);
        [error, usersList] = await to(Users.aggregatePaginate(userAggregate,options));
        if(error) TE(error.message,true);
        return usersList ? { users:usersList, permissions:obj}:false;
    },
    displayUserById:async(userId)=>{
        let error,user;
        [error, user] =  await to(Users.findById(userId).populate('role',{'roleName': 1}).populate([{path:'state', select:'state'},{path:'adharDistrict', select:'district'}]));
        if(error) TE(error.message,true);
        return user? user:false;
    },
    displayUserByCounselorId:async(id)=>{
        let error,user;
        [error, user] =  await to(Users.findOne({"counselor_id": id}));
        if(error) TE(error.message,true);
        if(user){
            return user? user:false;
        }
        else{
            TE("Counselor details did not found.!");
        }
    },
    userDropdown:async(query)=>{
        let error,user,filter={};
        filter.status = true;
        if(query && query.type){
            filter.accessLevel = query.type
        }
        [error, user] =  await to(Users.find(filter));
        if(error) TE(error.message,true);
        return user? user:false;
    },
    deleteUserById:async(userId)=>{
        let err, userData;
        [err, userData] = await to(Users.findById({ '_id': userId }));
        if (err) return err;
        if (!userData) {
            return false;
        } else {
            [err] = await to(Users.deleteOne({ '_id': userId }));
            if (err) return err;
            return 'Deletion Success';
        }
    },
    updateUser:async function(userId, payload){
        let err, user,updatedUser,duplicateUser;
        [err, user] = await to(Users.findById(userId));
        if(err) {TE(err, true)};
        if(payload.counselor_id && user.counselor_id !== payload.counselor_id){
            [err, duplicateUser] = await to(Users.find({'counselor_id':payload.counselor_id}));
            if(err) {TE(err, true)}
            if(duplicateUser.length>0){
                {TE("User already exists with this counselor id.!");}
            }else{
                user.counselor_id  = payload.counselor_id? payload.counselor_id : user.counselor_id;
            }
        }
        if(user.email === payload.email){
            user.fullName = payload.fullName? payload.fullName: user.fullName;
            user.phone = payload.phone? payload.phone : user.phone;
            user.email = payload.email? payload.email : user.email;
            user.state  = payload.state? payload.state : user.state;
            user.adharDistrict  = payload.adharDistrict? payload.adharDistrict : user.adharDistrict;
            user.role  = payload.role? payload.role : user.role;
            user.accessLevel = payload.accessLevel? payload.accessLevel : user.accessLevel;
            user.status = payload.hasOwnProperty('status') ? payload.status : user.status;
            [err,updatedUser] = await to(user.save());
            if(err) {TE(err, true)};
            return updatedUser;
        }else{
            [err, duplicateUser] = await to(Users.find({'email':payload.email}));
            if(err) {TE(err, true)}
            if(duplicateUser.length>0){
                {TE("User already exists with this email.!");}
            }else{
                user.fullName = payload.fullName? payload.fullName: user.fullName;
                user.phone = payload.phone? payload.phone : user.phone;
                user.email = payload.email? payload.email : user.email;
                user.state  = payload.state? payload.state : user.state;
                user.adharDistrict  = payload.adharDistrict? payload.adharDistrict : user.adharDistrict;
                user.role  = payload.role? payload.role : user.role;
                user.accessLevel = payload.accessLevel? payload.accessLevel : user.accessLevel;
                user.status = payload.hasOwnProperty('status') ? payload.status : user.status;
                [err,updatedUser] = await to(user.save());
                if(err) {TE(err, true)};
                return updatedUser;
            }  
        }
    },
    // usersFilters : async(user,query,payload)=>{
    //     let error, usersList,roleData,obj,filter={};
    //     [error,roleData] = await to(UserRoles.find({"_id": user.role},{"users":1}));
    //     if(error) {TE(error, true);}
    //     if(roleData){
    //         obj = roleData[0].users;
    //     };
    //     let options = {
    //         sort: { createdAt: -1 },
    //         lean: true,
    //         page: query.page? query.page:1,
    //         limit: query.limit? query.limit:10
    //     };
    //     if(payload.hasOwnProperty('fullName') && payload.fullName !== ''){
    //         filter.fullName = { $regex : payload.fullName };
    //     }
    //     if(payload.hasOwnProperty('email') && payload.email !== ''){
    //         filter.email ={ $regex: payload.email } 
    //     }
    //     if(payload.hasOwnProperty('role') && payload.role !== ''){
    //         filter.role = new mongoose.Types.ObjectId(payload.role);
    //     }
    //     if(user.accessLevel == 'counselor'){
    //         filter.createdBy = new mongoose.Types.ObjectId(user._id);
    //     }
    //     let userAggregate = Users.aggregate([
    //         {
    //             $match:filter
    //         },{
    //             $lookup:{
    //                 from:"user_roles",
    //                 localField:"role",
    //                 foreignField:"_id",
    //                 as:"role"
    //             }
    //         },{
    //             $unwind:{ 'path': '$role', 'preserveNullAndEmptyArrays': true }
    //         },{
    //             $lookup:{
    //                 from:"Users",
    //                 localField:"createdBy",
    //                 foreignField:"_id",
    //                 as:"createdBy"
    //             }
    //         },{
    //             $unwind:{ 'path': '$createdBy', 'preserveNullAndEmptyArrays': true }
    //         },{
    //             $project:{
    //                 "role._id":1,"role.roleName":1,
    //                 "_id":1,"email":1,"fullName":1,
    //                 "phone":1,"accessLevel":1,"status":1,
    //                 "createdBy._id":1,"createdBy.fullName":1,"createdAt":1,"updatedAt":1
    //             }
    //         }
    //     ]);
    //     [error, usersList] = await to(Users.aggregatePaginate(userAggregate,options));
    //     if(error) TE(error.message,true);
    //     return usersList ? { users:usersList, permissions:obj}:false;
    // },
    // addRedeemPoints: async function(payload,id){
    //     let err, counselorDetails,updatedData;
    //     [err, counselorDetails] = await to(Users.findOne({"counselor_id":id}));
    //     if(err) {TE(err, true)};
    //     if(counselorDetails && payload){
    //         let redeemPoints = counselorDetails.redeemedPoints;
    //         redeemPoints.push(payload);
    //         counselorDetails.redeemedPoints = redeemPoints;
    //         [err,updatedData] = await to(counselorDetails.save());
    //         if(err) {TE(err, true)};
    //         return updatedData;
    //     }
    //     else{
    //         TE("Counselor details did not found.!");
    //     }
    // },
    // displayUserServicePointsByCounselorId:async(id,collegeId,courseId,districtType)=>{
    //     let error,user,pointStructure,points=0;
    //     [error, user] =  await to(Users.findOne({"counselor_id": id}));
    //     if(error) TE(error.message,true);
    //     [error, pointStructure] = await to(PointStructure.findOne({"college":collegeId},{"courseList":{$elemMatch:{"value":courseId}}}));
    //     if (error) TE(err.message, true);
    //     if(pointStructure){
    //         districtType = districtType==="Free Zone"?"freeZone_servicePoints":(districtType==="Other District"?"otherDistrict_servicePoints":"ownDistrict_servicePoints");
    //         points = pointStructure.courseList.length>0 ? pointStructure.courseList[0][districtType]:0;
    //     }
    //     if(user){
    //         return user? {"user":user,"points":points}:false;
    //     }
    //     else{
    //         TE("Counselor details did not found.!");
    //     }
    // },
    // changeUserPassword:async(userId, payload)=>{
    //     let error,user;
    //     [error, user] =  await to(Users.findById(userId));
    //     if(error) TE(error.message,true);
    //     if(user){
    //         user.password = payload.password ? payload.password : user.password;
    //         [error, user] = await to(user.save());
    //         if(error) TE(error.message,true);
    //         return user? user:false;
    //     }else {
    //         TE("User not found with this ID");
    //     }
    // },
}