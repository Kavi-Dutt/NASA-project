const {
    checkLaunchExistById,
    getAllLaunches,
    addNewLaunch,
    abbortLaunchById,
} = require('../../models/launches.model');

function httpgetAllLunches(req, res) {
    res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
    let launch = req.body;

    if(!launch.launchDate || !launch.mission || !launch.rocket || !launch.target){
       return res.status(400).json({error : 'require details missing'});
    }

    launch.launchDate = new Date(launch.launchDate);

    if(isNaN(launch.launchDate).valueOf()){
        return res.status(400).json({error: 'date is not proper'});
    }
    
    addNewLaunch(launch);

    res.status(201).json(launch);
}

function httpAbbortLaunch(req, res){
    const launchId = Number(req.params.id);
    if(!checkLaunchExistById(launchId)){
        return res.status(401).json({
            error: 'launch does not exist',
        });
    }
    const abortedLaunch = abbortLaunchById(launchId);
    res.status(200).json(abortedLaunch);
}
module.exports = {
    httpgetAllLunches,
    httpAddNewLaunch,
    httpAbbortLaunch,
}