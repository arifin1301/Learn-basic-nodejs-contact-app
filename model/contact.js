const mongoose = require('mongoose')

const Contact = mongoose.model('Contact', {
    nama: {
        type: String,
        required: true
    },
    nohp: {
        type: String,
        required: true
    },
    alamat: {
        type: String
    },
})

module.exports = Contact
