var selectedImage;
var myDropZone;
$().ready(function () {
    if (location.protocol != 'https:') {
        location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }
    myDropZone = initDropZone();
    var slick = initSlick();
    addImages();
    $('.image-carousel').on("click", "img.thumbnail", function () {
        console.log("clicked " + $(this)[0].src);
        selectedImage = $(this)[0];
        getImageAnalysisV2($(this)[0], provider.MICROSOFT);
        getImageAnalysisV2($(this)[0], provider.IBM);
        getImageAnalysisV2($(this)[0], provider.CLARIFAI);
    });

    $('#clarifai-model-select').on("change", function () {
        if (selectedImage) {
            getImageAnalysisV2(selectedImage, provider.CLARIFAI);
        }
    });

    $('#image-category li').on("click", function () {
        addImages($(this).text());
        console.log($(this).text());
    });

    $('#ms-api-select').on("change", function () {
        console.log(this.value);
        if (selectedImage) {
            getImageAnalysisV2(selectedImage, provider.MICROSOFT);
        }
    });

    $('#ibm-api-select').on("change", function () {
        console.log(this.value);
        if (selectedImage) {
            getImageAnalysisV2(selectedImage, provider.IBM);
        }
    });
});


/**
 * init socket
 */
var io = io();

/**
 * io events
 */

io.on('deleteImage', function (data) {
    try {
        console.log('Server purged this file-->' + data);
        images = myDropZone.dropzone.getAcceptedFiles();
        var fileToRemove = images.reduce(function (acc, val) {
            if (val.image == data) {
                acc = data;
            }
        });
        addImages();
        myDropZone.dropzone.removeFile(fileToRemove);
    } catch (err) {
        //not for you
    }
});

/**
 * setup your DEV or PROD API Endpoint
 */
var apiEndpoint = "https://cognitive-compare.azurewebsites.net";
//var apiEndpoint = "http://localhost:3000";

var provider = {
    IBM: "IBM",
    MICROSOFT: "MICROSOFT",
    CLARIFAI: "CLARIFAI"
};
var opts = {
    lines: 13 // The number of lines to draw
        ,
    length: 28 // The length of each line
        ,
    width: 14 // The line thickness
        ,
    radius: 42 // The radius of the inner circle
        ,
    scale: 1 // Scales overall size of the spinner
        ,
    corners: 1 // Corner roundness (0..1)
        ,
    color: '#000' // #rgb or #rrggbb or array of colors
        ,
    opacity: 0.5 // Opacity of the lines
        ,
    rotate: 0 // The rotation offset
        ,
    direction: 1 // 1: clockwise, -1: counterclockwise
        ,
    speed: 1 // Rounds per second
        ,
    trail: 60 // Afterglow percentage
        ,
    fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        ,
    zIndex: 2e9 // The z-index (defaults to 2000000000)
        ,
    className: 'spinner' // The CSS class to assign to the spinner
        ,
    top: '50%' // Top position relative to parent
        ,
    left: '50%' // Left position relative to parent
        ,
    shadow: false // Whether to render a shadow
        ,
    hwaccel: false // Whether to use hardware acceleration
        ,
    position: 'absolute' // Element positioning
};
var addImages = function (imgurTags) {
    try {

        // $('.image-carousel')[0].slick.refresh();
        $('.image-carousel').slick("unslick");
        $('.image-carousel').empty();
    } finally {
        initSlick();
        if (!imgurTags) {
            imgurTags = "people";
        }

        $.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
                tags: imgurTags,
                tagmode: "any",
                format: "json"
            },
            function (data) {
                images = data.items;
                images.forEach(function (image) {
                    $('.image-carousel').slick('slickAdd', '<div><img alt-text="image" enctype="multipart/form-data" class="thumbnail" src="' + image.media.m + '"></img></div>');
                });
                $('.image-carousel')[0].slick.refresh();
                if (imgurTags === 'NSFW' && !$('image-carousel img').hasClass('mask-img')) {
                    $('.image-carousel img').addClass('mask-img');
                } else {
                    $('.image-carousel img').removeClass('mask-img');
                }
            });

        $.ajax({
            url: apiEndpoint + '/api/v0/getImages',
            type: 'GET',
            success: function (data, status) {
                var images = JSON.parse(data);
                images.forEach(function (image) {
                    $('.image-carousel').slick('slickAdd', '<div><img alt-text="image" enctype="multipart/form-data" class="thumbnail" src="' + image + '"></img></div>');
                });
                //$('.image-carousel').slick('slickSetOption','speed',5000,true);
                $('.image-carousel')[0].slick.refresh();
            },
            error: function (xhr, status, error) {
                console.log("xhr" + JSON.stringify(xhr) + "\nError:" + error);
            }
        });

    }
};

var removeImage = function (fileName) {
    $.ajax({
        url: apiEndpoint + '/api/v0/image/delete/' + fileName,
        type: 'DELETE',
        success: function (data, status) {
            //console.log('deleted file' + fileName);
            addImages();
        },
        error: function (xhr, status, error) {
            console.log("xhr" + JSON.stringify(xhr) + "\nError:" + error);
        }
    });
};

var initDropZone = () => {
    var dropZoneOpts = {
        url: apiEndpoint + "/api/v0/image/uploadimage",
        method: "POST",
        parallelUploads: "1",
        maxFilesize: 1,
        uploadMultiple: false,
        addRemoveLinks: true,
        maxFiles: 3,
        acceptedFiles: "image/png,image/gif,image/jpeg",
        dictDefaultMessage: "<h2><small>Click or Drop images here to Upload. Only PNG, JPEG and GIF images under 1MB are supported</small></h2>",
        init: function () {
            this.on("addedfile", function (file) {
                console.log("file added" + file);
            });
            this.on("maxfilesreached", function () {
                console.log('max file limit of 3 reached');
            });
            this.on("complete", function () {
                addImages();
            });
            this.on("removedfile", function (file) {
                console.log('Asked to remove image ' + file.name);
                removeImage(file.name);
            });
        }
    };

    $('#upload').append('<form id="add-my-image"></form>');
    $('form#add-my-image').addClass('dropzone');
    var myDz = $("form#add-my-image").dropzone(dropZoneOpts);
    return myDz[0];
};


var initSlick = () => {
    var opts = {
        centerMode: true,
        centerPadding: '60px',
        infinite: true,
        dots: true,
        arrows: false,
        variableWidth: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [{
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    return $('.image-carousel').slick(opts);
};
var buildResultPanel = function (panelName, parentPanelName, data) {
    try {
        $('#' + panelName).remove();
    } finally {
        $('#' + parentPanelName).append("<div id='" + panelName + "' class='panel-group'>" +
            "<div class='panel panel-default'>" +
            "<div class='panel-heading'><h2 class='panel-title'><a href='#" + panelName + "-body' data-toggle='collapse'>Analysis result</a></h2></div>" +
            "<div id='" + panelName + "-body' class='panelcollapse collapse'>" +
            "<div class='panel-body text-left'><pre><code>" +
            syntaxHighlight(data) +
            "</code></pre></div>" +
            "</div>" +
            "</div>" +
            "</div>");
    }
};
var getImageAnalysisV2 = function (imgObj, providerName) {
    switch (providerName) {
        case provider.IBM:
            ibmVisionRecognition.getIbmResult(imgObj.src, $('#ibm-api-select').val(), function (data, status, error) {
                if (!error) {
                    buildResultPanel("ibm-result-panel", "ibm-image-analysis", data);
                }
            });
            break;
        case provider.MICROSOFT:
            microsoftCognitiveSvc.getMsResult(imgObj.src, $('#ms-api-select').val(), function (data, status, error) {
                if (!error) {
                    buildResultPanel("ms-result-panel", "microsoft-image-analysis", data);
                }
            });
            break;
        case provider.CLARIFAI:
            clarifaiAi.getClarifaiResult(imgObj.src, $('#clarifai-model-select').val(), function (data, status, error) {
                if (!error) {
                    buildResultPanel("clarifai-result-panel", "clarifai-image-analysis", data);
                }
            });
            break;
        default:
            ""
    }

};

var syntaxHighlight = function (json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
};