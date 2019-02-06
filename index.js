/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**'use strict';

const {
    WebhookClient
} = require('dialogflow-fulfillment');
const http = require('http');
const serviceAccount = {}; // The JSON object looks like: { "type": "service_account", ... }

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({
        request,
        response
    });

    function makeAppointment(agent) {
        http.post('http://sb.ftdmobileapi.com/user/exists?email=baymaxalam%40gmail.com&uid=9MFPAH0OROD6VDEWEWQWTZYNB5NKML467RXO9WDMS9MIL122RM&type=android&appversion=11.0.0&app=sharisberries_android&design=1&scale=3.0', (resp) => {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log(JSON.parse(data).explanation);
                agent.add(JSON.parse(data).explanation);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    let intentMap = new Map();
    intentMap.set('intent.emailid', makeAppointment); // It maps the intent 'Make Appointment' to the function 'makeAppointment()'
    agent.handleRequest(intentMap);
});*/

"use strict";
const https = require('https');
const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post('/echo', (req, res) => {

    var speech =
    req.body.result &&
    req.body.result.parameters &&
    req.body.result.parameters.echoText
      ? req.body.result.parameters.echoText
      : "Seems like some problem. Speak again.";

    const reqUrl = encodeURI(`https://sb.ftdmobileapi.com/user/exists?email=baymaxalam%40gmail.com&uid=9MFPAH0OROD6VDEWEWQWTZYNB5NKML467RXO9WDMS9MIL122RM&type=android&appversion=11.0.0&app=sharisberries_android&design=1&scale=3.0`);
    https.post(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const movie = JSON.parse(completeResponse);
            
            return res.json({
                fulfillmentText: movie,
                fulfillmentText: speech,
                source: 'dialog-flow-webhook-1'
            });
        });
    }, (error) => {
        return res.json({
            fulfillmentText: 'Something went wrong!',
            fulfillmentText: 'Something went wrong!',
            source: 'dialog-flow-webhook-1'
        });
    });
});


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});


