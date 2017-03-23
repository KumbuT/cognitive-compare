var https = require('https');
var config = require('../config/config.js');
var secrets = require('../secrets/secrets.js');

var imageUrl = '';

var getImageAnalysis = function (imageUrl,apiMethod, callback) {
    console.log('imageUrl' + imageUrl);
    console.log('api' + apiMethod);
    var options = {
        host: 'westus.api.cognitive.microsoft.com',
        path: '/vision/v1.0/analyze?visualFeatures=Faces,Categories,Tags,Faces,Adult,Color,Description&details=Celebrities&language=en',
        method: 'POST',
        port: 443,
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': secrets.microsoft.computerVision.toString()
        }
    };
    switch(apiMethod){
        case "MsEmotionAPI":options.headers['Ocp-Apim-Subscription-Key'] = secrets.microsoft.emotion.toString();options.path='/emotion/v1.0/recognize/'; break;
        case "MsFaceAPI": options.headers['Ocp-Apim-Subscription-Key'] = secrets.microsoft.face.toString() ; options.path='/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses';break;
        case "MsComputerVisionApi":options.headers['Ocp-Apim-Subscription-Key'] = secrets.microsoft.computerVision.toString();options.path = '/vision/v1.0/analyze?visualFeatures=Faces,Categories,Tags,Faces,Adult,Color,Description&details=Celebrities&language=en'; break;
        default:options.headers['Ocp-Apim-Subscription-Key'] = secrets.microsoft.computerVision.toString(); options.path = '/vision/v1.0/analyze?visualFeatures=Faces,Categories,Tags,Faces,Adult,Color,Description&details=Celebrities&language=en';
    };
    console.log(JSON.stringify(options));
    var postData = JSON.stringify({
        'url': imageUrl
    });
    var req = https.request(options, function (res) {
        console.log(res.statusCode + ':' + res.statusMessage);

        if (res.statusCode == 200) {
            var body = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                var json = JSON.parse(JSON.stringify(eval("(" + body + ")")));
                callback(false, json);
            });

            res.on('error', (err) => console.log(err));

        } else {
            callback(res.statusCode, res.statusMessage);
        }
    });
    req.on('error', function(e){
        console.log('Problem with request : ' + e.toString());
        req.end();
    });
    // write data to request body
    req.write(postData);
    req.end();
};

module.exports = getImageAnalysis;