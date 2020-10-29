const Results = require('./models/results')

const getMostRecent = async (id) => {
    const mostRecent = await Results.find({id:{$ne: id}}).sort({date: -1}).limit(1);
    return mostRecent[0];
}

const getTopThree = async () => {
    const topThree = await Results.find().sort({wpm: -1}).limit(3);
    return topThree;
}

module.exports = {
    getMostRecent,
    getTopThree
};