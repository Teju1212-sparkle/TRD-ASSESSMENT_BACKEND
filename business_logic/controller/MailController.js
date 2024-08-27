let {to,TE,ReE,ReS} = require('../middlewares/utilities');
const mailService = require('../service/MailService');

module.exports = {
    send: async(req, res) => {
        let payload = req.body;
        let mailResponse;
        [err, mailResponse] = await to(mailService.notificationMail(payload));
        if(err) return res.status(500).json({"status": 500,"success": false,"message": err.message});
        if(mailResponse){ // && mailResponse!==false
            return res.status(200).json({"status": 200,"success": true,"data": mailResponse});
        }else{
            return res.status(404).json({"status": 404,"success": false,"message": "Cannot send email, Try again!"});
        }
    }

}