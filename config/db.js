const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017/test';

const MongoServer = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
             useUnifiedTopology: true,
              useCreateIndex: true,
              useFindAndModify: false
            });
        console.log(`Successfully connected to MongoDB using Mongoose`);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = MongoServer;