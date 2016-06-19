var mongoose = require('mongoose');

mongoose.connect(process.env.mongo_uri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('Mongodb Connected');
});
