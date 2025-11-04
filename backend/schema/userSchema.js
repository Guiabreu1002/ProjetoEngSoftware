const monguse = require('mongoose');

const userSchema = new monguse.Schema({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    verified: { type: Boolean, default: false },
    });

module.exports = monguse.model('User', userSchema);