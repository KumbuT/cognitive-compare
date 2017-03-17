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
    getPrediction: function (iUrl,model, callback) {
        if (!app) { this.initApp(); }
        var selectedModel;
        switch(model){
            case "Apparel": selectedModel = Clarifai.GENERAL_MODELl; break;
            case "Color": selectedModel = Clarifai.COLOR_MODEL; break;
            case "Celebrity": selectedModel = Clarifai.FACE_DETECT_MODEL; break;
            case "FaceDetection": selectedModel = Clarifai.FACE_DETECT_MODEL; break;
            case "Food": selectedModel = Clarifai.FOOD_MODEL; break;
            case "General": selectedModel = Clarifai.GENERAL_MODELl; break;
            case "NSFW": selectedModel = Clarifai.NSFW_MODEL; break;
            case "Travel": selectedModel = Clarifai.TRAVEL_MODEL; break;
            case "Wedding": selectedModel = Clarifai.WEDDINGS_MODEL; break;

        }
        app.models.predict(selectedModel, iUrl).then(
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