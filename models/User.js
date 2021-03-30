const mongoose = require('mongoose')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String
})

UserSchema.methods.validPassword = function(password) {
    let verify = crypto.pbkdf2Sync(password,this.salt,10000,64,'sha512').toString('hex')

    return this.hash === verify
}

UserSchema.statics.genpassword = function(password) {
    const salt = crypto.randomBytes(32).toString('hex')

    const hash = crypto.pbkdf2Sync(password,salt,10000,64,'sha512').toString('hex')

    return {
        salt,
        hash
    }
}

const User = mongoose.model('User',UserSchema)

module.exports = User