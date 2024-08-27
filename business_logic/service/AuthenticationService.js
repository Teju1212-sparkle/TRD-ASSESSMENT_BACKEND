'use strict'
var Users = require('../model/user');
const {to,ReS,ReE,TE} =  require('../middlewares/utilities');
const validator = require('validator');
const MailConfigurationService = require('./MailConfigurationService');
module.exports ={
    authentication: async function(payload){
        let error, user,token,json;
        if(validator.isEmail(payload.email)){
            [error,user] = await to(Users.findOne({'email':payload.email}));
            if (error) {
                TE(error.message, true);
            }
            if(user==undefined){
                TE("Invalid email address! please try again..")
            }
            if (user) {
                if (user.status !== true) {
                    TE("Your account is deactivated, please contact admin");
                }
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpData = { email, otp };

            let mailDetails={
                subject: 'Your OTP for Login',
                body: `Your OTP is: ${otp}`,
                to:user.email,
            

            }
            await to(mailService.notificationMail(mailDetails));
            await to(MailConfigurationService.createConfiguration(otpData));
            return user?user:false;
        }
    },
}