import Dimensions from 'Dimensions';

var stations = {
    'classical': {
        'url': 'http://zoomcast.vs.hc1.ca/cfmz.mp3',
        'logo': 'radio_classical',
        'video': 'background_video_classical',
        'buttons': {'play': 'button_play_classical', 'pause': 'button_pause_classical'}
        },
    'zoomer': {
        'url': 'http://zoomcast.vs.hc1.ca/cfzm.mp3',
        'logo': 'radio_zoomer',
        'video': 'background_video_zoomer',
        'buttons': {'play': 'button_play_zoomer', 'pause': 'button_pause_zoomer'}
        }
};

var screen_height = Dimensions.get('window').height;
var screen_width = Dimensions.get('window').width;

export {stations, screen_height, screen_width}