var express = require('express');
var fs = require('fs');
var router = express.Router();
var mkdirp = require('mkdirp');
var multer = require('multer');
var cognitiveService = require('../app_client/congnitiveService.js');
var watsonVisionService = require('../app_client/watsonVisualRecognition.js');
var clarifaiVisionAi = require('../app_client/clarifai.js');

//declare supported services
var imageAnalysisServiceProvider = {
    IBM: "IBM",
    MICROSOFT: "MICROSOFT",
    CLARIFAI: "CLARIFAI"
};
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

var processImage = function (req, res, next, serviceProvider) {
    try {
        var imageUrl = req.body.url;
        var model = req.body.model;
    }
    catch (e) { console.log(e); }
    finally {
        if (imageUrl !== '') {
            var callback = function (error, json) {
                //console.log(error + ':' + JSON.stringify(json));
                if (!error) {
                    res.send(json);
                }
                else {
                    console.log("Something went wrong " + error);
                    res.send({ error });
                }
            };
            try {
                switch (serviceProvider) {
                    case imageAnalysisServiceProvider.MICROSOFT: cognitiveService(imageUrl, callback); break;
                    case imageAnalysisServiceProvider.IBM: watsonVisionService(imageUrl, callback); break;
                    case imageAnalysisServiceProvider.CLARIFAI: clarifaiVisionAi.getPrediction(imageUrl, model, callback); break;
                }
            }
            catch (ex) {
                console.log(ex);
            }
        } else {
            res.send(json);
        }
    }
};

//api method switch
var myPostRouter = function (req, res, next) {
    console.log("Method " + req.params.method + " called\n");
    switch (req.params.method) {
        case 'processimageMS': processImage(req, res, next, imageAnalysisServiceProvider.MICROSOFT); break;
        case 'processimageIBM': processImage(req, res, next, imageAnalysisServiceProvider.IBM); break;
        case 'processimageClarifai': processImage(req, res, next, imageAnalysisServiceProvider.CLARIFAI); break;
        case 'uploadimage': uploadImages(req, res, next); break;
        default: console.log('Cannot figure out the route for this POST'); res.sendStatus({ code: "404" });
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
