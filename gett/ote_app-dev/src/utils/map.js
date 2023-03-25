import { deviceHeight, deviceWidth } from './ui';

const ASPECT_RATIO = deviceWidth / deviceHeight;
export const LATTITIDE_DELTA = 0.02;
export const LONGTITUDE_DELTA = LATTITIDE_DELTA * ASPECT_RATIO;

const toRadians = deg => deg * (Math.PI / 180);

const toDegrees = rad => rad * (180 / Math.PI);

export const getAngleBetweenCoordinates = ({ lat1, lng1, lat2, lng2 }) => {
  const lat1Rad = toRadians(lat1);
  const lng1Rad = toRadians(lng1);
  const lat2Rad = toRadians(lat2);
  const lng2Rad = toRadians(lng2);

  const y = Math.sin(lng2Rad - lng1Rad) * Math.cos(lat2Rad);
  const x = (Math.cos(lat1Rad) * Math.sin(lat2Rad)) -
    (Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lng2Rad - lng1Rad));
  const bearing = toDegrees(Math.atan2(y, x));

  return (bearing + 360) % 360;
};
