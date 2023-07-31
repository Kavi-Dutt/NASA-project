const express = require('express');

const { 
    httpgetAllLunches,
    httpAddNewLaunch,
    httpAbbortLaunch,
} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpgetAllLunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbbortLaunch);

module.exports = launchesRouter;