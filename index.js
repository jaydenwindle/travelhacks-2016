var express = require('express');
var app = express();
var config = require('./config.json');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

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
                console.log("Recieved Auth: " + messagingEvent)
                // receivedAuthentication(messagingEvent);
            } else if (messagingEvent.message) {
                console.log("Recieved Message: " + messagingEvent)
                // receivedMessage(messagingEvent);
            } else if (messagingEvent.delivery) {
                console.log("Recieved Delivery: " + messagingEvent)
                // receivedDeliveryConfirmation(messagingEvent);
            } else if (messagingEvent.postback) {
                console.log("Recieved Postback: " + messagingEvent)
                // receivedPostback(messagingEvent);
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


