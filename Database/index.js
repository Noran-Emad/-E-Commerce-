
// const mongoose = require('mongoose');
// require('dotenv').config();

// const connection = mongoose.connect(process.env.DBLINK).then(()=> console.log('DataBase connected'))

// module.exports = connection;

const mongoose=require('mongoose');
const dburl="mongodb://localhost/iti";
const dbConnection =mongoose.connect(dburl)
.then(()=> console.log("Connected to MongoDB..."))
.catch((err)=> console.log("could not connect to MonggoDB...",err))
module.exports=dbConnection;