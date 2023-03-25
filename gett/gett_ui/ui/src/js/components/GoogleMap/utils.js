/* global google */

import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import startIcon from 'assets/images/start.svg';
import finishIcon from 'assets/images/finish_marker_icon.svg';
import plusIcon from 'assets/images/plus.svg';
import minusIcon from 'assets/images/minus.svg';

export function toLatLng(lat, lng) {
  if (isArray(lat)) {
    [lat, lng] = lat;
  } else if (isPlainObject(lat)) {
    lng = lat.lng;
    lat = lat.lat;
  }

  return new google.maps.LatLng(lat, lng);
}

export function getIcon(icon, color ) {
  switch (icon) {
    case 'start':
      return {
        url: startIcon,
        anchor: new google.maps.Point(15, 35),
        scaledSize: new google.maps.Size(30, 38)
      };
    case 'personal-location':
      return {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='30' height='38' viewBox='0 0 30 38'>
              <defs>
                  <path id='a' d='M10 10a2.666 2.666 0 1 0 0-5.333A2.666 2.666 0 1 0 10 10zm0 1.333c-1.78 0-5.333.894-5.333 2.667v1.333h10.666V14c0-1.773-3.553-2.667-5.333-2.667z'/>
              </defs>
              <g fill='none' fill-rule='evenodd'>
                  <path fill='#1875F0' fill-rule='nonzero' d='M15.004 0c11.11 0 18.308 11.826 13.457 21.76C26.114 26.804 18.29 34.372 15.004 38 11.56 34.058 4.206 27.12 1.703 21.917-3.461 12.141 3.737 0 15.003 0zm0 5.676c5.163 0 9.389 4.258 9.389 9.46 0 5.204-4.226 9.462-9.39 9.462-5.163 0-9.388-4.258-9.388-9.461s4.225-9.46 9.389-9.46z'/>
                  <circle cx='15' cy='15' r='9' fill='#FFF' fill-rule='nonzero'/>
                  <use fill='#1875F0' fill-rule='nonzero' transform='translate(5 5)' xlink:href='#a'/>
              </g>
          </svg>
        `),
        anchor: new google.maps.Point(15, 35),
        scaledSize: new google.maps.Size(30, 38)
      };
    case 'stop-point':
      return {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12">
                <g fill="none">
                  <circle cx="6" cy="6" r="6" fill="#989898"/>
                  <circle cx="6" cy="6" r="3" fill="#fff"/>
                </g>
              </svg>
            `),
        anchor: new google.maps.Point(6, 6),
        scaledSize: new google.maps.Size(12, 12)
      };
    case 'affiliate-start':
      return {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns='http://www.w3.org/2000/svg' width='30' height='51'>
                <path d='M15 15c7.46 0 13.5 6.04 13.5 13.5S22.46 42 15 42 1.5 35.96 1.5 28.5 7.54 15 15 15z' fill='#fff'/>
                <path d='M29.5 28.46C29.5 20.49 23 14 15 14 7.01 14 .5 20.49.5 28.46c0 2.67.74 5.28 2.13 7.55l-.02.01c.11.17.22.33.34.49l.01.02c.96 1.42 2.16 2.66 3.56 3.67l.06.04.3.28h-.01l.14.13c3.98 3.68 6.33 5.85 8.08 10.35 2.11-4.99 3.41-6.17 9.54-11.71l.26-.23-.01-.01c2.94-2.73 4.62-6.59 4.62-10.59zM15 41.18c-7.03 0-12.75-5.7-12.75-12.72 0-7.01 5.72-12.71 12.75-12.71s12.75 5.7 12.75 12.71c0 7.02-5.72 12.72-12.75 12.72z' fill='#ffaf31'/>
                <path fill='#2b323f' d='M15.025 41.247c-2.088.032-4.508-.78-5.662-1.377.357-3.5.764-6.36.764-9.897-.02-1.035-.17-2.182-.395-3.95H9.62l-.057.282-.32.075s-.62 2.163-1.053 2.897c-.15.244-.15.545-.15.545-.02.414-.15 1.505-.377 2.52-.358 1.242-1.11 3.726-1.11 3.726l.132.112s.17.094.3.264c.076.113.264.45.34.827.037.208.45.716.526.98.02.112.076.244-.206.188-.282-.057-.602-.49-.62-.546-.038-.113-.433-.188-.433-.188-.093.32-.046.248-.046.286-.973-.956-.562-.538-1.364-1.396 0 0-.15-2.615 0-4.345-.038-1.092.47-2.277.602-3.218l.64-3.856H6.4c-.112-.414-.376-.395-.545-.828.677-1.805.847-3.14 1.844-4.213.66-.715 1.6-1.054 2.465-1.637.094-.056.17-.113.244-.17l.32-.225s.262-.226.357-.3c.093-.095.206-.264.206-.264l.038-.227.528.02c.13-.19-.113-1.544-.113-1.544-.075-.34-1.053-.904-1.542-1.41-.49-.51-.678-.942-.678-.942v.038c-.018.037-.037.17-.056.018 0-.15-.133-.545-.133-.545l-.056.018-.037-.076-.188-.037s.245-.188.263-.395c.02-.226-.206-.245-.112-.32.037-.02.037-.113.018-.188.038.037.076.056.076-.057 0-.207.225-.79.263-.79.038-.02.113.094.094-.075 0-.15.057-.376.057-.376l.112-.057c-.13-.113-.244.038-.244.038 0-.188.395-.263.395-.263-.02-.34.263-.3.263-.3s-.075.017-.15.13c-.076.132-.02.113.037.17.076.037.245-.226.282-.358.056-.132.13-.17.225-.3.076-.132-.02-.15-.02-.227l-.018-.075h.02l.13.113.34.02c.037-.02.225-.227.376-.227.17.02.414-.226.45-.226.02 0 .114 0 .114-.13 0-.114-.49.018-.15-.095.32-.113.507.094.507.094s.15-.093.283-.13c.13-.057.413 0 .45-.02l.02-.037.075-.057c.076-.094-.075-.207-.075-.207s.15.018.3.17c.152.15.114.318.34.412.225.113.413.433.45.49.058.075.452.376.603.507.17.13.357.582.414.79.037.188.15.64.395.996.243.358.3 1.9.32 2.088 0 .188-.472.62-.472.62s0 .152.076.396c.075.226.282.997.282.997l.15.02s.584-.114 1.073-.754c.488-.64 1.334-.77 1.372-.827.037-.038.81-.546 1.09-1.035.283-.507.584-.92.584-.92l.02-.038.018-.075c.188-.358.62-1.45 1.034-2.39.376-.846.753-1.56.753-1.56l.94-2.37s.02-.057.04-.15l.017-.49c-.056-.207-.17-.414-.17-.414s-.432-.433-.582-.677c-.207-.32-.17-.47-.17-.47s-.018-.245-.15-.396c-.207-.225-.564-.413-.564-.413s-.3-.132-.225-.226c.188-.244.64-.206.64-.206s.244.02.414.132c.262.188.525.49.525.49s.358.168.62.093c.34-.133.603-.528.603-.528l.49-1.825s.112-.338.375-.244c.245.075.245.376.245.376L24.8 2.34s-.038.13.02.206c.074.094.187.17.243.113.057-.076 1.298-1.524 1.298-1.524s.34-.414.528-.226c.17.207-.17.677-.17.677S25.57 3.11 25.684 3.092c.113 0 1.542-.94 1.542-.94s.452-.34.602-.114c.132.226-.263.527-.263.527s-1.467 1.016-1.392 1.09c.056.076 1.298-.055 1.298-.055s.528-.038.584.17c.056.187-.3.244-.3.244l-1.13.188s-.244.075-.395.17c-.226.13-.32.262-.32.262s-.17.377-.395.678c-.226.32-.508.583-.508.583l-.358 1.072s-.226 1.373-.603 2.67c-.414 1.393-.978 2.73-1.015 2.823-.17.677-.34 1.26-.34 1.26 0 1.58-.94 3.875-1.128 4.402-1.016 4.552-.64 13.242.34 16.31-.302.112-.51.187-.923.168.36 2.314.193 3.264.344 4.938-2.04 1.16-4.725 1.71-6.3 1.71z'/>
              </svg>
            `),
        anchor: new google.maps.Point(15, 49),
        scaledSize: new google.maps.Size(30, 51)
      };
    case 'finish':
      return {
        url: finishIcon,
        anchor: new google.maps.Point(15, 35),
        scaledSize: new google.maps.Size(30, 38)
      };
    case 'driver':
      if (!(color in getIcon.driverIconsCache)) {
        getIcon.driverIconsCache[color] = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'>
            <g fill='none' fill-rule='evenodd'>
              <circle cx='15' cy='15' r='15' fill='#FDB924' fill-rule='nonzero' />
              <path fill='#FFF' d='M9.636 13.25c.331-.727.642-1.496 1.037-2.328.207-.385.477-.748.912-.79h6.823c.457.042.706.405.934.79.394.832.705 1.601 1.037 2.327H9.636zM11.586 9c-.727 0-1.183.278-1.785 1.153l-1.016 2.349H7.23c-.228 0-.664 1.302.954 1.345l-.54 1.367c0 1.708.021 3.437.021 5.145 0 .363.27.641.622.641h2.095a.62.62 0 0 0 .622-.64v-1.431h7.985v1.43c0 .363.29.641.622.641h2.116a.62.62 0 0 0 .622-.64c0-1.709.02-3.438.02-5.146l-.56-1.367c1.64-.043 1.183-1.345.955-1.345h-1.556l-.995-2.349C19.59 9.278 19.155 9 18.408 9h-6.823zm8.482 6.32c-.56 0-1.017.47-1.017 1.047 0 .576.457 1.046 1.017 1.046.56 0 1.016-.47 1.016-1.046 0-.577-.456-1.047-1.016-1.047zm-10.142 0c.56 0 1.016.47 1.016 1.047 0 .576-.456 1.046-1.016 1.046s-1.016-.47-1.016-1.046c0-.577.456-1.047 1.016-1.047z' />
            </g>
          </svg>
        `);
      }
      return {
        url: getIcon.driverIconsCache[color],
        anchor: new google.maps.Point(15, 15),
        scaledSize: new google.maps.Size(30, 30)
      };
    default: {
      console.error(`Error: Wrong icon (${icon}) for marker`);
      return;
    }
  }
}

getIcon.driverIconsCache = {};

export function ZoomControl(controlDiv, map) {
  // Creating divs & styles for custom zoom control
  controlDiv.style.marginRight = '10px';
  // Set CSS for the control wrapper
  const controlWrapper = document.createElement('div');
  Object.assign(controlWrapper.style, {
    backgroundColor: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '0 auto',
    width: '20px',
    height: '40px'
  });
  controlDiv.appendChild(controlWrapper);

  // Set CSS for the zoomIn
  const zoomInButton = document.createElement('div');
  Object.assign(zoomInButton.style, {
    width: '20px',
    height: '20px',
    backgroundImage: `url(${plusIcon})`
  });
  controlWrapper.appendChild(zoomInButton);

  // Set CSS for the zoomOut
  const zoomOutButton = document.createElement('div');
  Object.assign(zoomOutButton.style, {
    width: '20px',
    height: '20px',
    backgroundImage: `url(${minusIcon})`
  });
  controlWrapper.appendChild(zoomOutButton);

  // Setup the click event listener for the zoom
  google.maps.event.addDomListener(zoomInButton, 'click', function() {
    map.setZoom(map.getZoom() + 1);
  });

  google.maps.event.addDomListener(zoomOutButton, 'click', function() {
    map.setZoom(map.getZoom() - 1);
  });
}

export const defaultLondonCenter = {
  // corresponds to approximate center of London
  lat: 51.507,
  lng: -0.128
};
