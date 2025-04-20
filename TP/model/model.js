const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    montant: {
        required: true,
        type: Number
    },
    categorie: {
        required: true,
        type: String
    },
    date: {
        required: true,
        type: Date
    },
    type: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Data', dataSchema)