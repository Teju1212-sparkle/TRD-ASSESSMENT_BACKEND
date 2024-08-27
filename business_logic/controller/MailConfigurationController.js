const {to,TE,ReE,ReS} = require('../middlewares/utilities');
const mailConfigurationService = require('../service/MailConfigurationService');
module.exports = {
    createConfiguration : async(req, res)=>{
        let configurationDetails, error;
        let payload = req.body;
        [error, configurationDetails] = await to(mailConfigurationService.createConfiguration(payload,req.user._id));
        if(error) return res.status(500).json({"status": 500,"success": false,"message": error.message});
        if(configurationDetails && configurationDetails!==false){
            return res.status(201).json({"status": 201,"success": true,"data": configurationDetails});
        }else{
            return res.status(401).json({"status": 404,"success": false,"message": "Cannot create mail configuration. Try again!"});
        }
    },
    verifyOtp: async function(req,res){
        let err,configuration_data;
        [err,configuration_data] = await to(mailConfigurationService.verifyOtp(req.body));
        if(err) return res.status(500).json({"status": 500,"success": false,"message": err.message});
        if(configuration_data && configuration_data!==false){
            return res.status(200).json({"status": 200,"success": true,"data": configuration_data});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot find mail configuration. Try again!"});
        }
    },
    
}