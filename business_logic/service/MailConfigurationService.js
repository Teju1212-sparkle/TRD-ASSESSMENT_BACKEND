'use strict'
const { to, TE } = require('../middlewares/utilities');
const MailConfiguration = require('../model/MailConfiguration');
module.exports = {
    createConfiguration: async (payload, userId) => {
        let newConfiguration, error, configurationData, err;
        newConfiguration = new MailConfiguration(payload);
        [error, newConfiguration] = await to(newConfiguration.save());
        if (error) TE(error.message, true);
        return newConfiguration;
    },
    verifyotpDetails: async (payload) => {
        let err, configuration_details;
        // Get the current date and time
        const currentDate = new Date();

        // Calculate the timestamp for two minutes ago
        const twoMinutesAgo = new Date(currentDate.getTime() - 2 * 60 * 1000);


        [err, configuration_details] = await to(MailConfiguration.findOne({ 'email': payload.email, 'otp': payload.otp, createdAt: { $gte: twoMinutesAgo } }));
        if (err || configuration_details == null) TE('Entered OTP invalid/expired. Try again!');
        await to(MailConfiguration.deleteOne({ 'email': payload.email, 'otp': payload.otp }));
        return configuration_details;
    },

}