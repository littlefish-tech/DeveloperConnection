const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");


// connect to mongo DB, use async await 
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected...")
    } catch(err) {
        console.log(err.message);
        // exit process with failer;
        process.exit(1)
    }
}

module.exports = connectDB;