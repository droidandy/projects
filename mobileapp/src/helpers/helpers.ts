import { Linking, Platform } from 'react-native';
import { ListPharmacyFragment } from '../apollo/requests';

const phoneClearRegExp = /[()\s-]+/g;
export function callTo(phone: string): Promise<any> {
  const url = `${Platform.OS === 'ios' ? 'telprompt:' : 'tel:'}${phone.replace(
    phoneClearRegExp,
    '',
  )}`;

  return Linking.canOpenURL(url)
    .then(canOpen => {
      if (canOpen) {
        return Linking.openURL(url).catch(e => Promise.reject(e));
      }

      return Promise.resolve(canOpen);
    })
    .catch(console.warn);
}

//region круглосуточные аптеки
const scheduleChecker = /^\s*00?\s*-\s*24$/;
const DaysSequence = [
  'workSunday',
  'workMonday',
  'workTuesday',
  'workWednesda',
  'workThursday',
  'workFriday',
  'workSaturday',
] as const;

export const testAroundTheClock = (pharmacy: ListPharmacyFragment): boolean => {
  const dayKey = DaysSequence[new Date().getDay()];
  return scheduleChecker.test(pharmacy[dayKey]);
};
//endregion

export const getBase64Img = (b64?: string): string => {
  return `data:image/png;base64,${b64}`;
};

const re = /[А-Я0-9]+.*/;
export const sortStreets = (s1: string, s2: string): number => {
  const m1 = s1.match(re);
  const m2 = s2.match(re);
  const t1 = m1 ? m1[0] : s1[0];
  const t2 = m2 ? m2[0] : s2[0];
  return t1.localeCompare(t2, 'ru');
};

// function getDelta(lat: number, lon, number, distance: number): Coordinates {
//   const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
//
//   const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
//   const longitudeDelta = distance / (oneDegreeOfLatitudeInMeters * Math.cos(lat * (Math.PI / 180)));
//
//   return {
//     latitude: lat,
//     longitude: lon,
//     latitudeDelta,
//     longitudeDelta,
//   };
// }
export const clamp = (value: number, min: number, max: number) => {
  let res = value;
  if (value < min) {
    res = min;
  } else if (value > max) {
    res = max;
  }
  console.log(`clamp of ${value} in [${min}, ${max}] = ${res}`);
  return res;
};
