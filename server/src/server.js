const http = require('http');
const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

async function startServer() {
    try {
        await loadPlanetsData();
        server.listen(PORT, () => {
            console.log(`listening on port ${PORT}`);
        })
    } catch (err) {
        console.error(`error occuere while starting the server ${err}`)
    }
}

startServer();
