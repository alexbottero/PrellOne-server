const throwError = require('../utils/throwError')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    initials: {
        type: String
    },
    profilePicture: {
        type: String,
        default: 'https://prellone.s3.amazonaws.com/johan/lapin-c2b35fd3-1d16-4572-88ca-cfcbad6d17c2.jpeg'
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        select: false
    },
    loginType: {
        type: String, 
        enum: ['classic', 'ldap', 'oauth'], 
        default: 'classic'
    },
    boards: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Board' 
    }],
    teams: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Team' 
    }]
}, 
{ timestamps: true })

UserSchema.pre('save', async function(next) {
    const user = await mongoose.model('user', UserSchema).findOne({email: this.email});
    if(user) throwError(400, "This email already exists!")
    next()
})
.pre('save', async function(next) {
    const user = await mongoose.model('user').findOne({username: this.username});
    if(user) throwError(400, "This username is already taken!")
    next()
})

UserSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id
        delete ret._id
        delete ret.createdAt
        delete ret.updatedAt
        delete ret.__v
        return ret
    }
}

mongoose.model('User', UserSchema)
module.exports = mongoose.model('User')