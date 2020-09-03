const mongoose = require('mongoose');
const atriclesSchema = mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    body: {type: String, required: true}
})

module.exports = mongoose.model('Articles', atriclesSchema);