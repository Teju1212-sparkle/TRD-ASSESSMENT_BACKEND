var mongoose        = require('mongoose');
var bcrypt = require("bcryptjs");
var Schema          = mongoose.Schema;
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
var userSchema = mongoose.Schema({
    email           : {type: String,required: true,unique: true},
    password        : {type: String,required: true},
    fullName        : {type: String,required: false,default:null},
    // phone           : {type: String, required: false},
    // counselor_id    : {type: String, required:false},
    // state           : {type: Schema.Types.ObjectId, ref: 'State', required: false},
    // adharDistrict   : {type: Schema.Types.ObjectId, ref: 'District', required: false},
    // Embed Role Document
    // role            : {type: mongoose.Schema.Types.ObjectId, ref: 'user_roles', required: false},
    // createdBy            : {type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false,default:null},
    // accessLevel     : {type:String, required:false,default:null},
    // status: {type: Boolean,required: true,default: 1},
}, {
    versionKey: false,
    timestamps: true
}
);
userSchema.pre('save', function (next) {

    var user = this;
    // generate a salt

    if (user.isModified("password") || user.isNew) {

        bcrypt.genSalt(10, function (error, salt) {

            if (error) return next(error);

            // hash the password along with our new salt

            bcrypt.hash(user.password, salt, function (error, hash) {

                if (error) return next(error);

                // override the cleartext password with the hashed one

                user.password = hash;

                next(null, user);
            });
        });

    } else {
        next(null, user);
    }
});

/**
 * Compare raw and encrypted password
 * @param password
 * @param callback
 */
userSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (error, match) {
        if (error) callback(error);
        if (match) {
            callback(null, true);
        } else {
            callback(error, false);
        }
    });
}
userSchema.plugin(aggregatePaginate);
module.exports = mongoose.model('Users',userSchema,'Users');
