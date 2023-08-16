const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const launches = new Map();
const Default_Flight_NUMBER = 121;
const launch = {
    flightNumber: 121,
    mission: 'explore 442 b',
    launchDate: new Date('2023 August 13'),
    rocket: 'pslv 3',
    target: 'kepler-1410 b',
    customer: ['Tech karma', 'spaceX'],
    upcoming: true,
    success: true,

}

saveLaunch(launch);

function checkLaunchExistById(id) {
    return launches.has(id);
}

async function getLatestFligtNumber() {
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');

    if (!latestLaunch) {
        return Default_Flight_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches() {
    return await launchesDatabase.find({}, {
        '_id': 0,
        '__v': 0
    })
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({ 
        keplerName: launch.target 
    });

    if (!planet) {
        throw new Error('target planet does not exist in habitable planet list');
    }

    const newFlightNumber = await getLatestFligtNumber() + 1;

    const newLaunch = Object.assign(launch,{
        flightNumber: newFlightNumber,
        customer: ['Tech Karma', 'spaceX'],
        upcoming: true,
        success: true,
    });

    await saveLaunch(newLaunch);

}

async function saveLaunch(launch) {
    await launchesDatabase.findOneAndUpdate(
        {
            flightNumber: launch.flightNumber,
        }, launch, {
        upsert: true,
    }
    )
}

function abbortLaunchById(id) {
    const abort = launches.get(id);
    abort.upcoming = false;
    abort.success = false;
    return abort;
}

module.exports = {
    checkLaunchExistById,
    getAllLaunches,
    scheduleNewLaunch,
    abbortLaunchById,
}