const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const launches = new Map();
let startingFlightNumber = 121;
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
async function getAllLaunches() {
    return await launchesDatabase.find({}, {
        '_id': 0,
        '__v': 0
    })
}

function addNewLaunch(launch) {
    startingFlightNumber++
    launches.set(startingFlightNumber, Object.assign(launch, {
        flightNumber: startingFlightNumber,
        customer: ['Tech Karma', 'spaceX'],
        upcoming: true,
        success: true,
    }))
}

async function saveLaunch(launch) {
    const planet = planets.findOne({ keplerName: launch.target });
    if (!planet) {
        throw new Error('Planet name not contain in habitable planet list');
    } else {
        await launchesDatabase.updateOne(
            {
                flightNumber: launch.flightNumber,
            }, launch, {
            upsert: true,
        }
        )
    }
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
    addNewLaunch,
    abbortLaunchById,
}