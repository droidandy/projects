/* global google */

import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import driverStatuses from 'utils/driverStatuses';
import startIcon from 'images/start_marker_icon.png';
import finishIcon from 'images/finish_marker_icon.png';

export function toLatLng(lat, lng) {
  if (isArray(lat)) {
    [lat, lng] = lat;
  } else if (isPlainObject(lat)) {
    lng = lat.lng;
    lat = lat.lat;
  }

  return new google.maps.LatLng(lat, lng);
}

export function getMarkerIcon(type) {
  const icon = {};
  const color = '#ffaf31';

  if(~Object.keys(driverStatuses).indexOf(type.toString())) {
    icon.url = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='305' height='305'>
        <g>
          <circle fill='${color}' fill-opacity='0.8' cx='152.5' cy='152.5' r='152.5' />
          <path fill='#fff' d='M240.6 132l-11-1.4c-2.1-.3-3.9 1.3-4 3.4l-.2 4.7-4.1 2.6.3.4h-1.7l-12.1-40.2c-1.5-5.1-7.2-9.3-12.5-9.3h-21.8V85c0-3.7-3.1-6.8-6.8-6.8h-28.5c-3.7 0-6.8 3.1-6.8 6.8v7.2h-21.7c-5.3 0-11 4.2-12.5 9.3l-12.1 40.2h-1.7l.3-.4-4.1-2.6-.2-4.7c-.1-2.1-1.9-3.6-4-3.4l-11 1.4c-2.1.3-3.7 2.2-3.6 4.3l.1 2.5c.1 1.9 1.6 3.6 3.5 3.9l10.2 2.1c-4.4 3.2-7.3 8.4-7.3 14.2v42.1h7.1v19c0 3.7 3.1 6.8 6.8 6.8h12.7c3.7 0 6.8-3.1 6.8-6.8v-19H204v19c0 3.7 3.1 6.8 6.8 6.8h12.7c3.7 0 6.8-3.1 6.8-6.8v-19h7.7V159c0-5.8-2.9-11-7.3-14.2l10.2-2.1c1.9-.3 3.4-1.9 3.5-3.9l.1-2.5c-.1-2-1.8-4-3.9-4.3zm-132.8-26.9c.8-2.6 3.6-4.6 6.3-4.6h76.8c2.7 0 5.5 2.1 6.3 4.6l11.2 36.5H96.6l11.2-36.5zm16.3 70.8h57.3c1 0 1.8.7 1.8 1.5s-.8 1.5-1.8 1.5h-57.3c-1 0-1.8-.7-1.8-1.5.1-.8.9-1.5 1.8-1.5zm-1.4-4.3c0-.8.8-1.5 1.8-1.5h56.7c1 0 1.8.7 1.8 1.5s-.8 1.5-1.8 1.5h-56.7c-1-.1-1.8-.7-1.8-1.5zm-25.3 13.7c-7.5 0-13.6-6.1-13.6-13.6s6.1-13.6 13.6-13.6 13.6 6.1 13.6 13.6-6 13.6-13.6 13.6zm84.5-.6h-57.8c-1 0-1.8-.7-1.8-1.5s.8-1.5 1.8-1.5h57.8c1 0 1.8.7 1.8 1.5-.1.8-.9 1.5-1.8 1.5zm25.7.6c-7.5 0-13.6-6.1-13.6-13.6s6.1-13.6 13.6-13.6 13.6 6.1 13.6 13.6-6.1 13.6-13.6 13.6z' />
        </g>
      </svg>
    `);
    icon.anchor = [15, 15];
  } else if (type === 'start') {
    icon.url = startIcon;
    icon.anchor = [15, 29];
  } else if (type === 'finish') {
    icon.url = finishIcon;
    icon.anchor = [15, 29];
  }

  icon.scaledSize = [30, 30];

  return {
    url: icon.url,
    anchor: new google.maps.Point(...icon.anchor),
    scaledSize: new google.maps.Size(...icon.scaledSize)
  };

}
