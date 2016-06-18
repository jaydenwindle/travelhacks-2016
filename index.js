var express = require('express');
var app = express();
var config = require('./config.json');
var bodyParser = require('body-parser');
var message = require('./messaging.js');
var request = require('request');

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
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function(pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function(messagingEvent) {
            if (messagingEvent.optin) {
                console.log("Recieved Auth: " + JSON.stringify(messagingEvent));
                //receivedAuthentication(messagingEvent);
            } else if (messagingEvent.message) {
                console.log("Recieved Message: " + JSON.stringify(messagingEvent));
                var id = messagingEvent.sender.id;
                message.getProfile(id, function (body) {
                    console.log(body);
                    message.send(id, "Hello " + body.first_name + "!");
                })
                //receivedMessage(messagingEvent);
            } else if (messagingEvent.delivery) {
                console.log("Recieved Delivery: " + JSON.stringify(messagingEvent));
                //receivedDeliveryConfirmation(messagingEvent);
            } else if (messagingEvent.postback) {
                console.log("Recieved Postback: " + JSON.stringify(messagingEvent));
                //receivedPostback(messagingEvent);
            } else {
                console.log("Webhook received unknown messagingEvent: ", messagingEvent);
            }
            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know you've 
        // successfully received the callback. Otherwise, the request will time out.
        res.sendStatus(200);
    }
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


