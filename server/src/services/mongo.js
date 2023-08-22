const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://nasa-api:liZJhmnn2ZjlFF6U@cluster1.mxsaicj.mongodb.net/nasa?retryWrites=true&w=majority';

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