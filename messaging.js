var request = require('request');

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
        // TODO: remove hardcoded token
        qs: { access_token: 'EAAS02wu2ZB1ABAPaGBfvhvfJCcv0dfwE1tgliP8fz1Utzbm6NTd0rymSX5pRHyfrPlxbmQqTzpVyFXzNuc4l0qKvnYAIfqSm4qFrJLPmLEOcVBbN3uwoCDcqaGvlsUSRFzAJupkYwMjBvAHdtUJmL3UXEQZBS5aXFxuiVrcgZDZD' },
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
