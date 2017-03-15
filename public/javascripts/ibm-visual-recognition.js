var ibmSpinner;
var ibmVisionRecognition = {
    getIbmResult: function (imageUrl, callbackIbm) {
        let iUrl = imageUrl;
        iUrl = imageUrl.replace(/^(\/\/||\/)*/g, '');
        if (!iUrl.startsWith('http')) {
            iUrl = "http://" + iUrl;
        }
        console.log("ImageUrl:" + iUrl);
        let postData = { 'url': iUrl };
        $.ajax({
            url: apiEndpoint +'/api/v0/image/processimageIBM',
            type: 'POST',
            data: postData,
            success: function (data, status) { callbackIbm(data, status, null); },
            error: function (xhr, status, error) {
                console.log("xhr" + JSON.stringify(xhr) + "\nError:" + error);
                callbackIbm(data, status, error);
            },
            beforeSend: function () {
                console.log("Preparing to call  IBM Visual Recognition service on " + iUrl);
                ibmSpinner = new Spinner(opts).spin();
                $('#ibm-image-analysis').append(ibmSpinner.el);
            },
            complete: function () {
                console.log("Recieved response from IBM Visual Recognition service");
                if (ibmSpinner) {
                    ibmSpinner.stop();
                }
            }
        });
    }
};
