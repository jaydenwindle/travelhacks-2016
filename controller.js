var mongoose = require('mongoose');

mongoose.connect(process.env.mongo_uri);
var Schema = mongoose.Schema;
var userSchema, User, guideSchema, Guide;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('Mongodb Connected');

});

userSchema = new Schema({
    userId: Number,
    userName: String,
    loc: {
        lat: Number,
        lon: Number
    }
});
User = mongoose.model('User', userSchema);

guideSchema = new Schema({
    guideId: Number,
    name: String,
    phone: Number,
    city: String,
});
Guide = mongoose.model('Guide', guideSchema);

activitySchema = new Schema({
    guideId: Number,
    name: String,
    loc: Number,
    city: String,
    date: String
});
Activity = mongoose.model('Activity', guideSchema);

module.exports = {
    User: User,
    Guide: Guide,
    Activity: Activity
}
