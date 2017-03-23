var chokidar = require('chokidar');
var timers = require('timers');
var fs = require('fs');
var path = require('path');


var socket;
var filePurge = {
    startWatching: function (io) {
        var watcher = chokidar.watch(appRoot + '/public/images', {
            usePolling: false,
            ignoreInitial: true,
            depth: 2,
            awaitWriteFinish: true,
            ignorePermissionErrors: true,
            atomic: true
        });
        console.log('Started Watching Folder');
        watcher.on("add", path => {
            console.log(`File ${path} has been added`);
            this.startTimer(path);
        });
        socket = io;
    },
    startTimer: function (filePath) {
        console.log(`${filePath} is scheduled to be deleted`);
        setTimeout(() => {
            fs.unlink(filePath, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(`Deleted file ${filePath}`);
                    socket.emit('deleteImage', path.basename(filePath));
                    fs.readdir(path.dirname(filePath), (err, files) => {
                        if (err) { console.log(err); }
                        if (files.length == 0) {
                            fs.rmdir(path.dirname(filePath), (err) => { if (err) { console.log(err); } });
                        }
                    });
                }

            });
        },300000);
    }
};

module.exports = filePurge;