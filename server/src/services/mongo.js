const mongoose = require('mongoose');

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('conection', ()=>{
    console.log('connected to server');
});

mongoose.connection.on('error', (err)=>{
    console.error(`error occured while connecting to mongo server => => => ${err}`);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}