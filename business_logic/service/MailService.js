let {to,TE,ReE,ReS} = require('../middlewares/utilities');
var nodemailer = require('nodemailer');
const MailConfiguration = require('../model/MailConfiguration');
module.exports = {
    sendMail: async(payload) => {
      let configDetails, err, error;
        // if(!payload.to) TE("To email is required!");
        // if(!payload.body) TE("Email body is required!");
        // [err,configDetails] = await to(MailConfiguration.findOne({'name':"default"}).populate('createdBy','email'));
        if(err || configDetails==null) TE('Error in getting default mail configuration data');
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
           // secure: false, // true for 465, false for other ports // use SSL or not
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD
            },
          });
          let mailOptions = {
            from: process.env.EMAIL_FROM,     
            to: payload.to,   
            subject: payload.subject,
            html: "<div>"+payload.body+"<div>"  
          };
          
          [error,data] = await to(transporter.sendMail(mailOptions));
          if(error) {
            TE(error.message,true);
          }
          return "Email sent successfully";
    },
    notificationMail: async(payload) => {
      let configDetails, err, error,admission;
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
           // secure: false, // true for 465, false for other ports // use SSL or not
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD
            },
          });
          let mailOptions = {
            from: process.env.EMAIL_FROM,     
            to: payload.to,   
            subject: payload.subject,
            html: payload.body
          };
          
          [error,data] = await to(transporter.sendMail(mailOptions));
          if(error) {
            TE(error.message,true);
          }
          return "Email sent successfully";
    }
}

// +" Surname : "+admission.firstName+"\n"+
// +" Student Name : "+admission.lastName+"\n"+
// +" Full Name : " +admission.fullName+"\n"+
// +" Gender : "+admission.gender+"\n"+
// +" Date of Birth : "+ admission.dob+"\n"+
// +" Father Name : "+ admission.fatherName+"\n"+
// +" Mother Name : "+ admission.motherName+"\n"+
// +" Parent Phone Number : "+admission.parentPhone+"\n"+
// +" Parent Email : "+ admission.parentEmail+"\n"+
// +" Student Whatsapp Number : "+ admission.stdWtsAppNo+"\n"+
// +" Studnet Email : "+admission.stdEmail+"\n"+
// +" Adhaar No : "+admission.adhaarCardNo+"\n"+
// +" State : "+admission.state.state+"\n"+
// +" District : "+admission.district.district+"\n"+
// +" Address : "+admission.address+"\n"+
// +" Pincode : "+admission.pincode+"\n"+
// +" Nationality : "+admission.nationality+"\n"+
// +" Religion : "+admission.religion+"\n"+
// +" College : "+admission.college+"\n"+
// +" Branch : "+admission.branch+"\n"+
// +" Course : "+admission.course+"\n"+
// +" Specialization : "+ admission.specialization+"\n"+
// +" Academic Year : "+admission.academicYear.academicYearName+"\n"+
// +" Counsellor : "+admission.createdBy.fullName+"</div>"