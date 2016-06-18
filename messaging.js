var request = require('request');
var config = require('./config.json');

function send(recipientId, messageText) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			text: messageText
		}
	};

    console.log('Calling send api');
	callSendAPI(messageData);
}

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.page_token },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log("Successfully sent generic message with id %s to recipient %s", 
            messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    }, function (err, resp, body) {
        console.log(body);
    });  
}

function getProfile(id, callback) {
    request.get({
        uri: 'https://graph.facebook.com/v2.6/' + id,
        qs: {
            fields: 'first_name, last_name, profile_pic, locale, timezone, gender',
            access_token: process.env.page_token,
        }
    }, function (err, resp, body) {
        callback(body);
    });
}

module.exports = {
    send:  send,
    getProfile: getProfile,
}
