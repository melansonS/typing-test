const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultsSchema = new Schema({
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
    score: {
        type: Number,
        required: true,
    }
})

const Results = mongoose.model('Results', resultsSchema);

module.exports = Results;