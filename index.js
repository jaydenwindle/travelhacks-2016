var express = require('express');
var app = express();
var config = require('./config.json');
var bodyParser = require('body-parser');
var message = require('./messaging.js');
var request = require('request');
var Wit = require('node-wit').Wit;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
 
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Stores all active sessions
// sessionID: { id:  FB_USER_ID, context: WIT_CONTEXT }
var sessions = {}

function getSessionId(userId) {
    var sessionId;

    Object.keys(sessions).forEach(function (s) {
        if (sessions[s] == userId) {
            sessionId = s;
        }
    });
    if (!sessionId) {
        sessionId = new Date().toISOString();
        sessions[sessionId] = {
            id: userId,
        }
    }
    return sessionId;
}

function getProfile(id, callback) {
    var ret;
    request.get({
        uri: 'https://graph.facebook.com/v2.6/' + id,
        qs: {
            fields: 'first_name, last_name, profile_pic, locale, timezone, gender',
            access_token: process.env.page_token,
        }
    }, function (err, resp, body) {
        ret = callback(body);
    });
    return ret;
}

// Wit.ai Actions
var actions = {
    say(sessionId, context, message, cb){
        id = context.id;
        if (id) {
            message.send(id, message);
        } else {
            console.log('Wit say error');
        }
    },
    merge(sessionId, context, entities, message, cb){
        console.log(sessionId, context, entities, message);
        cb(context);
    },
    error(sessionId, context, error){
        console.log(error);
    }
}

// Sets up wit
var witClient = new Wit(process.env.wit_token, actions);


// Home Page
app.get('/', function(request, response) {
    response.send("Welcome to Chiri");
});

// Let's facebook verify our app
app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.webhook_token) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);          
    }  
});

// Main message processing
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

                    // User Authenticated to our bot
                    console.log("Recieved Auth: " + JSON.stringify(messagingEvent));

                } else if (messagingEvent.message) {

                    // Recieved a message 
                    console.log("Recieved Message: " + JSON.stringify(messagingEvent));
                    var id = messagingEvent.sender.id;
                    sessionId = getSessionId(id);
                    message = messagingEvent.message.text;
                    atts = messagingEvent.attachments;
                    
                    console.log(sessionId, message, sessions[sessionId].context);
                    witClient.runActions(sessionId, message, sessions[sessionId].context, function (error, context) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Finished actions");
                        }
                    });

                } else if (messagingEvent.delivery) {
                    // Message sent successfully
                    console.log("Recieved Delivery: " + JSON.stringify(messagingEvent));

                } else if (messagingEvent.postback) {

                    // User clicked a button on a formatted message
                    console.log("Recieved Postback: " + JSON.stringify(messagingEvent));
                
                } else {
                    // some error
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


