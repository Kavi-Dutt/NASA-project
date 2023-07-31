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

launches.set(launch.flightNumber, launch);

function checkLaunchExistById(id) {
    return launches.has(id);
}
function getAllLaunches() {
    return Array.from(launches.values());
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

function abbortLaunchById(id){
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