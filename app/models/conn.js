const mongoose = require('mongoose');

//Connecting Database with Async/Await

async function connect(){
    try {
    //  await mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,useFindAndModify : false })
    await mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,useFindAndModify : false })
        console.log("Connected Succesfully");
    } catch (err) {
        console.log(err);
    }

}
connect();