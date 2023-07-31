const { getAllPlanets } = require('../../models/planets.model');

function httpgetAllPlanets(req, res) {
    res.status(200).json(getAllPlanets());
}

module.exports = {
    httpgetAllPlanets,
}