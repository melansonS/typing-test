const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultsSchema = new Schema({
    cpm: {
        type: Number,
        required: true
    },
    date: {
        type: Number,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    wpm: {
        type: Number,
        required: true,
    }
})

const Results = mongoose.model('Results', resultsSchema);

module.exports = Results;