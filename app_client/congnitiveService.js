var https = require('https');
var config = require('../config/config.js');
var secrets = require('../secrets/secrets.js');

var imageUrl = '';

var getImageAnalysis = function (imageUrl, callback) {
    console.log('imageUrl' + imageUrl);
    var options = {
        host: 'westus.api.cognitive.microsoft.com',
        path: '/vision/v1.0/analyze?visualFeatures=Faces,Categories,Tags,Faces,Adult,Color,Description&details=Celebrities&language=en',
        method: 'POST',
        port: 443,
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': secrets['Ocp-Apim-Subscription-Key'].toString()
        }
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
                console.log('calling callback');
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