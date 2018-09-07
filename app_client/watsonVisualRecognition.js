var https = require('https');
var config = require('../config/config.js');
var secrets = require('../secrets/secrets.js');
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

var visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    iam_apikey: secrets['watson-cloud-dev-api-key'].toString()
});


var getWatsonImageAnalysis = function (imageUrl, model, callback) {
    var params = {
        url: imageUrl,
        classifier_ids: [model],
        threshold: 0.0
    };
    visualRecognition.classify(params, function (err, response) {
        if (err) {
            console.log(err);
            callback(true, err)
        } else {
            callback(false, response);
        } //console.log(JSON.stringify(response, null, 2))
    });
};

module.exports = getWatsonImageAnalysis;