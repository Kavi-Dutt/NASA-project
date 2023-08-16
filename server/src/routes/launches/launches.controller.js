const {
    checkLaunchExistById,
    getAllLaunches,
    scheduleNewLaunch,
    abbortLaunchById,
} = require('../../models/launches.model');

async function httpgetAllLunches(req, res) {
    res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
    let launch = req.body;

    if(!launch.launchDate || !launch.mission || !launch.rocket || !launch.target){
       return res.status(400).json({error : 'require details missing'});
    }

    launch.launchDate = new Date(launch.launchDate);

    if(isNaN(launch.launchDate).valueOf()){
        return res.status(400).json({error: 'date is not proper'});
    }
    
    try{
        await scheduleNewLaunch(launch);
    } catch(error){
         console.log(error);
        return res.status(404).json({error: error.message});
    }

    res.status(201).json(launch);
}

async function httpAbbortLaunch(req, res){
    const launchId = Number(req.params.id);

    const isExist = await checkLaunchExistById(launchId);
    if(!isExist){
        return res.status(401).json({
            error: 'launch does not exist',
        });
    }

    const abortedLaunch = abbortLaunchById(launchId);
    if(!abortedLaunch){
        return res.status(400).json({error: 'launch not aborted'});
    }

    return res.status(200).json({
        ok: true,
    });
}

module.exports = {
    httpgetAllLunches,
    httpAddNewLaunch,
    httpAbbortLaunch,
}
