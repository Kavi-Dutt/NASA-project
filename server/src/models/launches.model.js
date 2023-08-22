const axios = require('axios');

const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const Default_Flight_NUMBER = 121;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

const launch = {
    flightNumber: 121,
    mission: 'explore 442 b',
    launchDate: new Date('2023 August 13'),
    rocket: 'pslv 3',
    target: 'kepler-1410 b',
    customers: ['Tech karma', 'spaceX'],
    upcoming: true,
    success: true,

}

saveLaunch(launch);

async function populateLaunches() {
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1,
                    }
                }
            ]
        }
    })

    if (response.status !== 200) {
        console.log('error occured in dolwloading launch data');
        throw new Error('Launch Data download failed');
    }
    const launchDocs = response.data.docs;

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap(payload => {
            return payload['customers'];
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        };

        console.log(`${launch.flightNumber} ${launch.mission}`);

        await saveLaunch(launch);
    }
}

async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    })

    if (firstLaunch) {
        console.log('Launch data already loaded in database!')
    } else {
        await populateLaunches();
    }
}

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

async function checkLaunchExistById(id) {
    return await findLaunch({
        flightNumber: id,
    })
}

async function getLatestFligtNumber() {
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');

    if (!latestLaunch) {
        return Default_Flight_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
    return await launchesDatabase.find({}, {
        '_id': 0,
        '__v': 0
    })
    .sort({
        flightNumber: 1,
    })
    .skip(skip)
    .limit(limit)
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    });

    if (!planet) {
        throw new Error('target planet does not exist in habitable planet list');
    }

    const newFlightNumber = await getLatestFligtNumber() + 1;

    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        customers: ['Tech Karma', 'spaceX'],
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

async function abbortLaunchById(id) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber: id,
    }, {
        success: false,
        upcoming: false,
    })

    return aborted.modifiedCount === 1;
}

module.exports = {
    loadLaunchData,
    checkLaunchExistById,
    getAllLaunches,
    scheduleNewLaunch,
    abbortLaunchById,
}