function init(argument) {
    var options = {
        logLevel: "DEBUG"
    };
    var flurryKey;
    if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
        flurryKey = "MW3D6KQK79FZF3T7HK59";
    } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
        flurryKey = "T2HR34ZCQ2HKPV4PBS5Y";
    }
    var flurry = new FlurryAnalytics();
    window.flurry = flurry;
    flurry.init(flurryKey, function() {
        console.log("Flurry initialized");
    }, function(err) {
        console.log('Flurry initial error: ', err);
    });
}

module.exports = {init};