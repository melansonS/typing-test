const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const SampleText = require('./models/sampleText')

require('dotenv').config();
mongoose.connect('mongodb+srv://bob:123@cluster0-dhphy.mongodb.net/<dbname>?retryWrites=true&w=majority', 
{
    useNewUrlParser: true,
    useUnifiedTopology: true 
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
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
        message:"Hello World! "
    })
});

app.post('/add-text', async (req, res, next) => {
    try {
        const newText = new SampleText(req.body);
        const savedText = await newText.save();
        res.json(savedText)        
    } catch (error) {
        next(error)
    }
})

app.get('/get-text', async (req, res, next) => {
    try {
        const text = await SampleText.find()
        const rand = Math.floor(Math.random() * (text.length));
        console.log("RANDOM NUMBER!? - ",rand)
        res.json({text: text[rand].text});
    } catch (error) {
        next(error)
    }
})
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 2000;

app.listen(port ,()=>{
    console.log("Listening on ", port)
});


