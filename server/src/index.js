const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const SampleText = require('./models/sampleText');
const Results = require('./models/results');

const helpers = require('./helpers');

require('dotenv').config();
mongoose.connect(process.env.MONGO_URl, {
        useNewUrlParser: true,
        useUnifiedTopology: true 
    });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to the db");
});

const middlewares = require('./middlewares');
const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message:"Hello World!"
    });
});

app.post('/add-text', async (req, res, next) => {
    try {
        const newText = new SampleText(req.body);
        const savedText = await newText.save();
        res.json(savedText);
    } catch (error) {
        next(error);
    }
});

app.post('/submit-result', cors(), async (req, res, next) => {
    console.log("Submition hit", req.body);
    try {
        const newResults = new Results(req.body);
        const savedResult = await newResults.save();
        const mostRecent = await helpers.getMostRecent();
        const topThree = await helpers.getTopThree();
        const responseObj = {
            success: true,
            savedResult,
            mostRecent,
            topThree,
        }
        res.json(responseObj);
    }catch (error) {
        next(error);
    }
});

app.post('/add-name', async (req, res, next) => {
    console.log("add-name hit", req.body);
    try {
        const id = req.body.id;
        const res = await Results.updateOne({'id': id}, {name: req.body.name});
        if(res.n < 1){
            throw new Error('Entry not found!');
        }
        const topThree =  await helpers.getTopThree();
        res.json({success: true, topThree});
    }catch (error) {
        next(error);
    }
});

app.get('/get-text', async (req, res, next) => {
    try {
        const text = await SampleText.find()
        const rand = Math.floor(Math.random() * (text.length));
        res.json({text: text[rand].text});
    } catch (error) {
        next(error);
    }
});

app.get('/most-recent', async (req, res, next) => {
    try {
        const mostRecent = await helpers.getMostRecent();
        res.json(mostRecent);
    } catch (error) {
        next(error);
    }
});

app.get('/top-three', async (req, res, next) => {
    try {
        const topThree = await helpers.getTopThree();
        res.json(topThree);
    } catch (error) {
        next(error);
    }
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 2000;
app.listen(port ,()=>{
    console.log("Listening on ", port)
});


