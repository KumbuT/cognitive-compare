var express = require('express');
var fs = require('fs');
var router = express.Router();
var mkdirp = require('mkdirp');
var multer = require('multer');
var cognitiveService = require('../app_client/congnitiveService.js');
var watsonVisionService = require('../app_client/watsonVisualRecognition.js');
var clarifaiVisionAi = require('../app_client/clarifai.js');

// Code for image upload and management
var storage = multer.diskStorage({
    destination: function (req, res, callback) {
        mkdirp(appRoot + '/public/images/' + req.session.id, function (err) {
            if (err) { console.log(err) }
            else { console.log("Created a new folder for custom image upload") }
        });
        console.log(appRoot + '/public/images/' + req.session.id);
        callback(null, appRoot + '/public/images/' + req.session.id);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({ storage: storage }).array('file', 3);
var uploadImages = function (req, res, next) {
    //put business logic here
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            res.end("Error uploading file");
        }
        res.end("File is uploaded");
    });
};
// End of image upload and management

// Start of Microsoft Cognitive Service Route
var processImageMS = function (req, res, next) {
    console.log(req.body.url);
    var imageUrl = req.body.url;
    if (imageUrl !== '') {
        var callback = function (error, json) {
            console.log(error + ':' + JSON.stringify(json));
            if (!error) {
                res.send(json);
            }
            else {
                console.log("Something went wrong");
                res.send({ error });
            }
        };
        try {
            console.log('calling cognitivesvc');
            //remove the temp response after testing
            // var tmp = '{"categories":[{"name":"abstract_","score":0.00390625},{"name":"people_","score":0.83984375,"detail":{"celebrities":[{"name":"Satya Nadella","faceRectangle":{"left":597,"top":162,"width":248,"height":248},"confidence":0.999028444}]}}],"adult":{"isAdultContent":false,"isRacyContent":false,"adultScore":0.0934349000453949,"racyScore":0.068613491952419281},"tags":[{"name":"person","confidence":0.98979085683822632},{"name":"man","confidence":0.94493889808654785},{"name":"outdoor","confidence":0.938492476940155},{"name":"window","confidence":0.89513939619064331}],"description":{"tags":["person","man","outdoor","window","glasses"],"captions":[{"text":"Satya Nadella sitting on a bench","confidence":0.48293603002174407}]},"requestId":"0dbec5ad-a3d3-4f7e-96b4-dfd57efe967d","metadata":{"width":1500,"height":1000,"format":"Jpeg"},"faces":[{"age":44,"gender":"Male","faceRectangle":{"left":593,"top":160,"width":250,"height":250}}],"color":{"dominantColorForeground":"Brown","dominantColorBackground":"Brown","dominantColors":["Brown","Black"],"accentColor":"873B59","isBWImg":false},"imageType":{"clipArtType":0,"lineDrawingType":0}}';
            // var json = JSON.parse(JSON.stringify(eval("(" + tmp + ")")));
            // callback(false, json);
            cognitiveService(imageUrl, callback);

        }
        catch (ex) {
            console.log(ex);
        }
    } else {
        res.send(json);
    }
};
// End of Microsoft Cognitive Service Route


// Start of IBM Vision Service Route
var processImageIBM = function (req, res, next) {
    console.log(req.body.url);
    var imageUrl = req.body.url;
    if (imageUrl !== '') {
        var callback = function (error, json) {
            console.log(error + ':' + JSON.stringify(json));
            if (!error) {
                res.send(json);
            }
            else {
                console.log("Something went wrong");
                res.send({ error });
            }
        };
        try {
            watsonVisionService(imageUrl, callback);
        }
        catch (ex) {
            console.log(ex);
        }
    } else {
        res.send(json);
    }
};
// End of IBM Vision Service Route

// Start of Clarifai Vision Service Route
var processImageClarifai = function (req, res, next) {
    console.log(req.body.url);
    var imageUrl = req.body.url;
    if (imageUrl !== '') {
        var callback = function (error, json) {
            console.log(error + ':' + JSON.stringify(json));
            if (!error) {
                res.send(json);
            }
            else {
                console.log("Something went wrong");
                res.send({ error });
            }
        };
        try {
            clarifaiVisionAi.getPrediction(imageUrl, callback);
        }
        catch (ex) {
            console.log(ex);
        }
    } else {
        res.send(json);
    }
};
// End of Clarifai Vision Service Route

//start of get images
/* Accepts the GET request and looks up images in the folder identified by the session.id. If not found then sends the error message. If folder is found and no files then sends empty array.*/
var getImages = function (req, res, next) {
    try {
        fs.readdir(appRoot + '/public/images/' + req.session.id, function (err, files) {
            if (err) {
                res.end(JSON.stringify([]));
            } else {
                console.log(files);
                files.forEach(function (file, index, files) {
                    files[index] = '/images/' + req.session.id + '/' + file;
                });
                console.log(files);
                res.end(JSON.stringify(files));
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};
//end of get images

//api method switch
var myPostRouter = function (req, res, next) {
    console.log("Method " + req.params.method + " called\n");
    switch (req.params.method) {
        case 'processimageMS': processImageMS(req, res, next); break;
        case 'processimageIBM': processImageIBM(req, res, next); break;
        case 'processimageClarifai': processImageClarifai(req, res, next); break;
        case 'uploadimage': uploadImages(req, res, next); break;
        default: console.log('Cannot figure out the route for this POST'); res.end();
    };
};
//end of api method switch

var deleteImage = function (req, res, next) {
    fileName = req.params.fileName;
    fs.unlink(appRoot + '/public/images/' + req.session.id + '/' + fileName, function (err) {
        if (err) { console.log(err); } else { console.log('deleted file' + fileName); }
    });
    res.end();
};
router.post('/image/:method', myPostRouter);
router.get('/getImages', getImages);
router.delete('/image/delete/:fileName', deleteImage);
module.exports = router;
