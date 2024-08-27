var mongoose=require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
var Schema=mongoose.Schema;
var mailSchema=new Schema({
        otp        : {type: Number, required: true},
        email       : {type: String, required: true},
        status      : {type: Boolean,  default: true}
    },{
        versionKey: false,
        timestamps: true
    }
);
mailSchema.plugin(mongooseAggregatePaginate);
var MailConfiguration=mongoose.model('MailConfiguration',mailSchema);
module.exports=MailConfiguration;