$().ready(function () {
    initDropZone();
    var slick = initSlick();
    addImages();
    $('.image-carousel').on("click", "img.thumbnail", function () {
        console.log("clicked " + $(this)[0].src);
        getImageAnalysis($(this)[0]);
    });
});

//setup your DEV or PROD API Endpoint
var apiEndpoint = "http://cognitive-compare.azurewebsites.net";
//var apiEndpoint = "http://localhost:3000";

var opts = {
    lines: 13 // The number of lines to draw
    , length: 28 // The length of each line
    , width: 14 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.5 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
};
var addImages = function () {
    console.log("called addImages");
    try {

        // $('.image-carousel')[0].slick.refresh();
        $('.image-carousel').slick("unslick");
        $('.image-carousel').empty();
    }
    finally {
        initSlick();
        // for (i = 1; i < 6; i++) {
        //     $('.image-carousel').slick('slickAdd', '<div><img alt-text="image" enctype="multipart/form-data" class="thumbnail" src="/images/' + i + '.jpg"></img></div>');
        // }
        //$('.image-carousel')[0].slick.refresh();
        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
            {
                tags: "people",
                tagmode: "any",
                format: "json"
            },
            function (data) {
                images = data.items;
                images.forEach(function (image) {
                    $('.image-carousel').slick('slickAdd', '<div><img alt-text="image" enctype="multipart/form-data" class="thumbnail" src="' + image.media.m + '"></img></div>');
                });
                $('.image-carousel')[0].slick.refresh();
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
            console.log('deleted file' + fileName);
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
            this.on("addedfile", function (file) { console.log("file added" + file); });
            this.on("maxfilesreached", function () { console.log('max file limit of 3 reached'); });
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
    var myDropZone = $("form#add-my-image").dropzone(dropZoneOpts);
};


var initSlick = () => {
    var opts = {
        centerMode: true,
        centerPadding: '60px',
        infinite:true,
        dots: true,
        arrows: false,
        variableWidth: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
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

var getImageAnalysis = function (imgObj) {
    //write code here
    console.log("Iniside getImageAnalysis " + imgObj.src);
    microsoftCognitiveSvc.getMsResult(imgObj.src, function (data, status, error) {
        if (!error) {
            try { $('#ms-result-panel').remove(); }
            finally {
                $('#microsoft-image-analysis').append("<div id='ms-result-panel' class='panel-group'>"
                    + "<div class='panel panel-default'>"
                    + "<div class='panel-heading'><h2 class='panel-title'><a href='#ms-panel-body' data-toggle='collapse'>Analysis result</a></h2></div>"
                    + "<div id='ms-panel-body' class='panelcollapse collapse'>"
                    + "<div class='panel-body text-left'><pre><code>"
                    + syntaxHighlight(data)
                    + "</code></pre></div>"
                    + "</div>"
                    + "</div>"
                    + "</div>");
            }
        }
    });

    ibmVisionRecognition.getIbmResult(imgObj.src, function (data, status, error) {
        if (!error) {
            try { $('#ibm-result-panel').remove(); }
            finally {
                $('#ibm-image-analysis').append("<div id='ibm-result-panel' class='panel-group'>"
                    + "<div class='panel panel-default'>"
                    + "<div class='panel-heading'><h2 class='panel-title'><a href='#ibm-panel-body' data-toggle='collapse'>Analysis result</a></h2></div>"
                    + "<div id='ibm-panel-body' class='panelcollapse collapse'>"
                    + "<div class='panel-body text-left'><pre><code>"
                    + syntaxHighlight(data)
                    + "</code></pre></div>"
                    + "</div>"
                    + "</div>"
                    + "</div>");
            }
        }
    });

    clarifaiAi.getClarifaiResult(imgObj.src, function (data, status, error) {
        if (!error) {
            try { $('#clarifai-result-panel').remove(); }
            finally {
                $('#clarifai-image-analysis').append("<div id='clarifai-result-panel' class='panel-group'>"
                    + "<div class='panel panel-default'>"
                    + "<div class='panel-heading'><h2 class='panel-title'><a href='#clarifai-panel-body' data-toggle='collapse'>Analysis result</a></h2></div>"
                    + "<div id='clarifai-panel-body' class='panelcollapse collapse'>"
                    + "<div class='panel-body text-left'><pre><code>"
                    + syntaxHighlight(data)
                    + "</code></pre></div>"
                    + "</div>"
                    + "</div>"
                    + "</div>");
            }
        }
    });

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

