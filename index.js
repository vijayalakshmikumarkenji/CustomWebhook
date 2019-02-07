"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const { actionssdk } = require('actions-on-google');
const { WebhookClient } = require('dialogflow-fulfillment');
const restService = express();
const request = require('request-promise-native');

restService.use(
    bodyParser.urlencoded({
        extended: true
    })
);

restService.use(bodyParser.json());

restService.post("/echo", function (req, res) {
    //console.log('nouvelle requete');
    //console.log(req.body);
    const app = actionssdk();
    const agent = new WebhookClient({ request: req, response: res });
    const email_intent = 'intent.emailid';
    let intentMap = new Map();
    intentMap.set('intent.emailid', handleemailidrequest);
    // intentMap.set('<INTENT_NAME_HERE>', yourFunctionHandler);
    // intentMap.set('<INTENT_NAME_HERE>', googleAssistantHandler);
    agent.handleRequest(intentMap);

});

function handleemailidrequest(agent) {

    console.log(agent.query);
    var speech = agent.query;

    var options = {
        uri: "https://sb.ftdmobileapi.com/user/exists?email=" + "baymaxalam@gmail.com" + "&uid=9MFPAH0OROD6VDEWEWQWTZYNB5NKML467RXO9WDMS9MIL122RM&type=android&appversion=11.0.0&app=sharisberries_android&design=1&scale=3.0"
        ,
        json: true
    };

    return request.get(options)
        .then(result => {
            console.log(result);           
            agent.add("you are there");
            return Promise.resolve(agent);
        });
}

restService.listen(process.env.PORT || 5001, function () {
    console.log("Server up and listening");
});