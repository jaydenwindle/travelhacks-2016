var express = require('express');
var app = express();
var config = require('./config.json');
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(request, response) {
    response.send("Welcome to Chiri");
});

app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === config.webhook_token) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);          
    }  
});

app.post('/webhook', function(req, res) {
    console.log(JSON.stringify(req.body.messaging));
    res.sendStatus(200);
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


