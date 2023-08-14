const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        rquired: true,
    },
});

module.exports = mongoose.model('Planet', planetsSchema);