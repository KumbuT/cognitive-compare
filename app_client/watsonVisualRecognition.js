var https = require('https');
var config = require('../config/config.js');
var secrets = require('../secrets/secrets.js');

var getWatsonImageAnalysis = function (imageUrl, callback) {
    console.log('imageUrl' + imageUrl);
    var queryString = 'api_key=' + secrets['watson-cloud-dev-api-key'].toString() + '&url=' + imageUrl + '&version=2018-03-19';

    var options = {
        host: 'gateway.watsonplatform.net',
        path: '/visual-recognition/api/v3/detect_faces?' + queryString,
        method: 'GET',
        port: 443
    };
    console.log(JSON.stringify(options));
    var req = https.request(options, function (res) {
        console.log(res.statusCode + ':' + res.statusMessage);
        var postData = JSON.stringify({
            'url': imageUrl
        });
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
    req.on('error', function (e) {
        console.log('Problem with request : ' + e.toString());
        req.end();
    });
    // write data to request body
    //req.write(postData);
    req.end();
};

module.exports = getWatsonImageAnalysis;
