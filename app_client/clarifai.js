// Require the client
var Clarifai = require('clarifai');
var config = require('../config/config.js');
var secrets = require('../secrets/secrets.js');
var app =null;

// instantiate a new Clarifai app passing in your clientId and clientSecret
var clarifaiVisionAi = {
    initApp: function () {
        if (!app) {
            app = new Clarifai.App(
               secrets.clarifai.clientId,
               secrets.clarifai.clientSecret
            );
        }
    },
    getPrediction: function (iUrl, callback) {
        if (!app) { this.initApp(); }
        app.models.predict(Clarifai.GENERAL_MODEL, iUrl).then(
            function (response) {
                console.log(response);
                callback(null,response);
            },
            function (err) {
                console.error(err);
                callback(err,null);
            }
        );
    }
};


module.exports = clarifaiVisionAi;