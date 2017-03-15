var msSpinner;

var microsoftCognitiveSvc = {
    getMsResult: function (imageUrl, callbackMS) {
        let iUrl = imageUrl;
        iUrl = imageUrl.replace(/^(\/\/||\/)*/g, '');
        if (!iUrl.startsWith('http')) {
            iUrl = "http://" + iUrl;
        }
        console.log("ImageUrl:" + iUrl);
        let postData = { 'url': iUrl };

        $.ajax({

            url: apiEndpoint + '/api/v0/image/processimageMS',
            type: 'POST',
            data: postData,
            success: function (data, status) { callbackMS(data, status, null); },
            error: function (xhr, status, error) {
                console.log("xhr" + JSON.stringify(xhr) + "\nError:" + error);
                callbackMS(data, status, error);
            },
            beforeSend: function () {
                console.log("Preparing to call cognitive service");
                msSpinner = new Spinner(opts).spin();
                $('#microsoft-image-analysis').append(msSpinner.el);
            },
            complete: function () {
                console.log("Recieved response from cognitive service");
                if (msSpinner) {
                    msSpinner.stop();
                }
            }
        });
    }
};
