const mongoose = require('mongoose');
require('dotenv').config();

const connection = mongoose.connect(process.env.DBLINK).then(()=> console.log('DataBase connected'))

module.exports = connection;