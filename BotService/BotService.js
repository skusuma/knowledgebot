// For more information about this template visit http://aka.ms/azurebots-node-qnamaker

"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var builder_cognitiveservices = require("botbuilder-cognitiveservices");
var path = require('path');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
        appId: process.env['MicrosoftAppId'],
        appPassword: process.env['MicrosoftAppPassword'],
        stateEndpoint: process.env['BotStateEndpoint'],
        openIdMetadata: process.env['BotOpenIdMetadata']
    });

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

var recognizer = new builder_cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: process.env.QnAKnowledgebaseId,
    subscriptionKey: process.env.QnASubscriptionKey});

var qnaMakerTools = new builder_cognitiveservices.QnAMakerTools();
bot.library(qnaMakerTools.createLibrary());

var model='https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/appId?subscription-key=subscriptionKey&verbose=true&timezoneOffset=0&q=';
var luisRecognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer, luisRecognizer] });
bot.dialog('/', intents);

intents.matches('Greeting', builder.DialogAction.send('Hello! How can I help you?'));

intents.matches('qna', [
    function (session, args, next) {
        var answerEntity = builder.EntityRecognizer.findEntity(args.entities, 'answer');
        session.send(answerEntity.entity);
    }
]);

intents.onDefault([
    function(session){
        var question = '{"question":"'+session.message.text+'"}';
        session.send('Sorry!! No match!! Pls. try again after couple of days');
        var https = require('https');
        var headers = {
            'Content-Type': 'application/json'
        };

        var options = {
            host: "slacknotifier.azurewebsites.net",
            path: "/api/HttpTriggerJS1?code=functionCode",
            method: "POST",
            headers: headers
        };

        var req = https.request(options, function(res){
            console.log("statusCode: ", res.statusCode);
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
            });
        });
        req.write(question);
        req.end();
        req.on('error', function(e) {
            console.error(e);
        });




    }
]);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    var listener = connector.listen();
    var withLogging = function(context, req) {
        console.log = context.log;
        listener(context, req);
    }
    module.exports = { default: withLogging }

}
