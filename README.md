
<a href="http://cognitive-compare.azurewebsites.net"><img src="http://cognitive-compare.azurewebsites.net/favicon.ico" height="48px" width="48px"></img></a><h1>cognitive-compare</h1>

----
Cognitive Compare is a pilot project to compare computer vision services from leading providers like:
 - [x] Microsoft
 - [x] IBM
 - [x] Clarifai
 - [ ] Google

### Table of contents
 1. [Tech](#Tech)
    1. [Npm Modules](#npm-modules)
 2. [APIs Supported](#API)
 
### Tech <a name="Tech"></a>
----
Cognitive Compare is built on several open-source technologies:

* [jQuery](http://jquery.com/) - Coz it's cool
* [Twitter Bootstrap](http://v4-alpha.getbootstrap.com/) - great UI boilerplate for modern web apps
* [node.js](nodejs.org) - evented I/O for the backend
* [Express](expressjs.com) - fast node.js network app framework

**Npm Modules:** <a name="npm-modules"></a>
* [socket.io](https://www.npmjs.com/package/socket.io) - broadcast to client
* [multer](https://www.npmjs.com/package/multer) - for file uploads
* [express-session](https://www.npmjs.com/package/express-session) - for easy session management
* [chokidar](https://www.npmjs.com/package/chokidar) - A great upgrade to node.js file watcher

### APIs Supported<a name="API"></a>
|Provider|Service|API Methods| Description|
|---|---|---|---|
|**Microsoft**|Computer Vision|[Analyze Image][1]|This operation extracts a rich set of visual features based on the image content.|
|**Microsoft**|Emotion Recognition API v1.0|[Emotion Recognition][2]|Recognizes the emotions expressed by one or more people in an image, as well as returns a bounding box for the face. The emotions detected are happiness, sadness, surprise, anger, fear, contempt, and disgust or neutral. |
|**Microsoft**|Face API v1.0|[Face API][3]|Detect human faces in an image and returns face locations, and optionally with faceIds, landmarks, and attributes.|
|**IBM**|Visual Recognition|[Visual Recognition][4]|The IBM Watson™ Visual Recognition service uses deep learning algorithms to analyze images for scenes, objects, faces, and other content. The response includes keywords that provide information about the content.|
|**Clarifai**|Clarifai API|[Predict][5]|The Clarifai API offers image and video recognition as a service. Whether you have one image or billions, you are only steps away from using artificial intelligence to recognize your visual content.<br><h4>Implemented Models</h4><ul><li>Apparel *Coming Soon*</li><li>Celebrity *Coming Soon*</li><li>Color</li><li>Face Detection</li><li>Food</li><li>General</li><li>NSFW</li><li>Travel</li><li>Wedding</li>|
|**Google**||||

License
----

MIT

[1]: https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa
[2]: https://westus.dev.cognitive.microsoft.com/docs/services/5639d931ca73072154c1ce89/operations/563b31ea778daf121cc3a5fa
[3]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236
[4]: https://www.ibm.com/watson/developercloud/doc/visual-recognition/index.html
[5]: https://sdk.clarifai.com/js/latest/index.html
