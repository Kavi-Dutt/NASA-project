const { parse } = require('csv-parse');
const { open } = require('node:fs/promises');
const path = require('path');

let filehandle;
let planets = [];
let habitablePlanet = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise(async (resolve, reject) => {
        try {
            filehandle = await open(path.join(__dirname, '..', '..', 'data', 'planet-data.csv'));
            filehandle.createReadStream().pipe(parse({
                comment: '#',
                columns: true,
            })).on('data', (data) => {
                planets.push(data);
                if (isHabitablePlanet(data)) {
                    habitablePlanet.push(data);
                }
            }).on('end', async () => {
                resolve();

            })
        } catch (err) {
            console.error(err);
            reject(err);
        }
    })
}

function getAllPlanets(){
    return habitablePlanet;
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
}