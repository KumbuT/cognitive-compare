var clarifaiSpinner;
var clarifaiAi = {
    getClarifaiResult: function (imageUrl, model, callback) {
        let iUrl = imageUrl;
        iUrl = imageUrl.replace(/^(\/\/||\/)*/g, '');
        if (!iUrl.startsWith('http')) {
            iUrl = "http://" + iUrl;
        }
        console.log("ImageUrl:" + iUrl);
        let postData = {
            'url': iUrl,
            'model': model
        };
        $.ajax({
            url: apiEndpoint + '/api/v0/image/processimageClarifai',
            type: 'POST',
            data: postData,
            success: function (data, status) { callback(data, status, null); },
            error: function (xhr, status, error) {
                console.log("xhr" + JSON.stringify(xhr) + "\nError:" + error);
                callback(data, status, error);
            },
            beforeSend: function () {
                console.log("Preparing to call  Clarifai service on " + iUrl);
                clarifaiSpinner = new Spinner(opts).spin();
                $('#clarifai-image-analysis').append(clarifaiSpinner.el);
            },
            complete: function () {
                console.log("Recieved response from Clarifai service");
                if (clarifaiSpinner) {
                    clarifaiSpinner.stop();
                }
            }
        });
    }
};
