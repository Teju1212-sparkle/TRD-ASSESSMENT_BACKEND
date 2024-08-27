'use strict'
const { verifyOtp } = require('../controller/MailConfigurationController');
const {to,TE} =  require('../middlewares/utilities');
const MailConfiguration = require('../model/MailConfiguration');
module.exports={
    createConfiguration : async(payload,userId)=>{
        let newConfiguration,error,configurationData,err;
        newConfiguration = new MailConfiguration(payload);
        [error,newConfiguration] = await to(newConfiguration.save());
        if(error) TE(error.message,true);
        return newConfiguration;
    },
    verifyOtp: async function(payload){
        let err,configuration_details;
        [err,configuration_details] = await to(MailConfiguration.findOne({'email':payload.email,'otp': payload.otp}));
        if(err || configuration_details==null) TE('Error in displaying mail configuration data');
        await to(MailConfiguration.deleteOne({ 'email': payload.email,'otp': payload.otp }));
        return configuration_details;
    },
    
}