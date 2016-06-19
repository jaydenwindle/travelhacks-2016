var mongoose = require('mongoose');

mongoose.connect(process.env.mongo_uri);
var Schema = mongoose.Schema;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('Mongodb Connected');

    var userSchema = new Schema({
        userId: Number,
        userName: String,
        loc: {
            lat: Number,
            lon: Number
        }
    });
    var User = mongoose.model('User', userSchema);

    var guideSchema = new Schema({
        guidId: Number,
        userName: String,
        city: String,
        daysAvailable: Array
    });
    var Guide = mongoose.model('Guide', guideSchema);
});

module.exports = {
    User: User,
    Guide: Guide
}
