const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sampleTextSchema = new Schema({
    text: {
        type: String,
        required: true
    },
})

const SampleText = mongoose.model('SampleText', sampleTextSchema);

module.exports = SampleText;