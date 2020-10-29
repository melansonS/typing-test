const Results = require('./models/results')

const getMostRecent = async () => {
    const mostRecent = await Results.find().sort({date: -1}).limit(1);
    console.log(mostRecent);
    return mostRecent[0];
}

const getTopThree = async () => {
    const topThree = await Results.find().sort({score: -1}).limit(3);
    console.log(topThree);
    return topThree;
}

module.exports = {
    getMostRecent,
    getTopThree
};