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

    var email_id =
        req.body.result &&
            req.body.result.parameters &&
            req.body.result.parameters.email
            ? req.body.result.parameters.email
            : "Seems like some problem. No user exists on DB";
    var target_url = "https://sb.ftdmobileapi.com/user/exists?email=" + email_id + "&uid=9MFPAH0OROD6VDEWEWQWTZYNB5NKML467RXO9WDMS9MIL122RM&type=android&appversion=11.0.0&app=sharisberries_android&design=1&scale=3.0";
    console.log("email id is :" + email_id);
    console.log("target url is :" + target_url);

    const reqUrl = encodeURI(target_url);
    https.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const user_exist_api = JSON.parse(completeResponse);
            console.log("user_exist_api reference---------: " + user_exist_api.reference);
            console.log("user_exist_api success---------: " + user_exist_api.success);
            var fullfillment_messges = "Hi" + req.body.result.parameters.username
                + "Congratulations you are an existing user"
                + "Welcome to FTD world";


            return res.json({
                fulfillmentText: movie.reference,
                fulfillmentMessages: fullfillment_messges,
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
  

