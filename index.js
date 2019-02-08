"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const { actionssdk } = require('actions-on-google');
const { WebhookClient } = require('dialogflow-fulfillment');
const restService = express();
const request = require('request-promise-native');
var username = "";
const utilConstants = require('utilConstants');
restService.use(
    bodyParser.urlencoded({
        extended: true
    })
);

restService.use(bodyParser.json());

restService.post("/echo", function (req, res) {

    const app = actionssdk();
    const agent = new WebhookClient({ request: req, response: res });
    let intentMap = new Map();
    intentMap.set('intent.emailid', handleEmailidRequest);
    intentMap.set('intent.username', handleUsernameRequest);
    intentMap.set('intent.emailid - yes', handleTypeOfGiftToOrder)
    agent.handleRequest(intentMap);

});

//When user says yes to the question "Do you want to buy any gift" asked in intent.emailid
function handleTypeOfGiftToOrder(agent) {
    console.log("Enter handleTypeOfGiftToOrder :" + utilConstants.base_url);
    agent.add("Select something from below gifts \n");

    var options = {
        uri: "https://sb.ftdmobileapi.com/product/list?uid=9MFPAH0OROD6VDEWEWQWTZYNB5NKML467RXO9WDMS9MIL122RM&type=android&appversion=11.0.0&app=sharisberries_android&design=1&scale=3.0",
        json: true
    };

    request.get(options).then(result => {
        console.log("product lists json :" + result);
        console.log("product lists json :" + JSON.parse(result).length);

        return Promise.resolve(agent);
    });


}

function handleUsernameRequest(agent) {
    console.log("username :" + agent.parameters.username);
    username = agent.parameters.username;
    agent.add("Hi " + username + "Can I check whether Are you an existing user");
    return Promise.resolve(agent);
}


function handleEmailidRequest(agent) {
    console.log("email :" + agent.parameters.email);
    console.log("username :" + username);
    var email_id = agent.parameters.email;
    var options = {
        uri: "https://sb.ftdmobileapi.com/user/exists?email=" + email_id + "&uid=9MFPAH0OROD6VDEWEWQWTZYNB5NKML467RXO9WDMS9MIL122RM&type=android&appversion=11.0.0&app=sharisberries_android&design=1&scale=3.0",
        json: true
    };

    return request.get(options)
        .then(result => {
            console.log(result.reference);
            if (result.reference == "ACCOUNT_EXISTS") {
                agent.add("Hi " + username + " you are already exist on FTD world :) Welcome :) Do you want to buy any gift??");
            } else {
                agent.add("You are new to FTD. Can I create an account for you");
            }

            return Promise.resolve(agent);
        });
}

restService.listen(process.env.PORT || 5001, function () {
    console.log("Server up and listening");
});