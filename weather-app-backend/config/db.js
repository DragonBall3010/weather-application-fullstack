//mongoose for MongoDB interaction
const mongoose = require('mongoose');


const config = require('config');

//MongoDB connection URI from environment variables.
const db = process.env.MONGO_URI;


//Function to handle asynchronous applications, like connecting to a database without blocking the execution of other code. 
const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            //useCreateIndex: true,
        });
        console.log('MongoDB Connected...');
    } catch(err){
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;


