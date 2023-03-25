function doOnOrientationChange() {
    console.log(window.orientation);
    switch(window.orientation)
    {
        case -90:
        case 90:
            console.log('landscape');
            //screen.lockOrientation('landscape');
            //screen.unlockOrientation();
            break;
        default:
            console.log('portrait');
            //screen.lockOrientation('portrait');
            //screen.unlockOrientation();
            break;
    }
}
function doOnOrientationChangeWeb() {
    console.log(window.orientation);
    switch(window.orientation)
    {
        case -90:
        case 90:
            console.log('landscape');
            break;
        default:
            console.log('portrait');
            break;
    }
}
$(document).on('DOMContentLoaded', function() {
    console.log('init DOMContentLoaded');
    window.addEventListener('orientationchange', doOnOrientationChangeWeb);
});
$(document).on('deviceready', function() {
    console.log('init deviceready');
    window.addEventListener('orientationchange', doOnOrientationChange);

    if (device){
        if (device.platform == 'Android') {

        }
        if (device.platform.indexOf("iOS") >= 0) {
            $("#sidedrawer-brand.mui--appbar-line-height.mui--text-title").css('padding-top','20px');
            $(".mui-container-fluid").css('padding-top','20px');
            $(".mui-appbar.mui--appbar-line-height").css('min-height','76px');
        }
    }
    if (window.plugins.insomnia){
        window.plugins.insomnia.keepAwake(function(msg){console.log(msg);})
    } else {
        console.log('plugin insomnia not install');
    }

});