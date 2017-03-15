var config = {
    default: {},
    production: {
        root: '../',
        app: {
            name: 'Image Analyzer V2 - Cognitive Compare'
        },
        port: process.env.port
    },
    dev:{
    }
};


module.exports = config;
