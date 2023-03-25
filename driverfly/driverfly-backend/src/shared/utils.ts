import { BadRequestException } from '@nestjs/common';
import moment = require('moment');
import { UserDeviceTokenEntity } from '../user/entities/user-device-token.entity';
//const convert = require('convert-units');
import fetch = require('node-fetch');

async function asyncForEach<Tin>(
  array: Tin[],
  callbackfn: (value: Tin, index: number, array: Tin[]) => Promise<void>,
) {
  for (let index = 0; index < array.length; index++) {
    await callbackfn(array[index], index, array);
  }
}
async function asyncMap<Tin, Tout>(
  array: Tin[],
  callbackfn: (value: Tin, index: number, array: Tin[]) => Promise<Tout>,
): Promise<Tout[]> {
  if (array.length == 0) return [];

  return await Promise.all(array.map((v, i, a) => callbackfn(v, i, a)));
}

function getPercentageChange(oldNumber, newNumber) {
  const decreaseValue = oldNumber - newNumber;

  return (decreaseValue / oldNumber) * 100;
}

function validateDates(dates) {
  dates.forEach((date) => {
    const valid = moment(date, 'YYYY-MM-DD', true).isValid();
    if (!valid)
      throw new BadRequestException(
        'The date needs to be formated like this: YYYY-MM-DD',
      );
  });
}
function lowerFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}
function upperFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// function checkUnit(unit, storedUnit) {
//   const possibleUnits = convert().from(storedUnit).possibilities();
//   if (!possibleUnits.includes(unit))
//     throw new BadRequestException(
//       `The unit '${unit}' is not supported. Should be one of the following: ${possibleUnits}`,
//     );
// }

// function convertAndFormat(value, decimals, initialUnit, finalUnit) {
//   return Number(
//     Number(convert(Number(value)).from(initialUnit).to(finalUnit)).toFixed(
//       decimals,
//     ),
//   );
// }

function succesResponse(data) {
  return {
    status: 'success',
    statusCode: 200,
    data: data,
  };
}
function convertMS(milliseconds) {
  let negative = false;
  if (milliseconds < 0) {
    negative = true;
    milliseconds = -milliseconds;
  }
  let day, hour, minute, seconds, week;
  seconds = Math.floor(milliseconds / 1000);
  minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  week = Math.floor(hour / 168);
  hour = hour % 168;
  day = Math.floor(hour / 24);
  hour = hour % 24;
  if (hour > 0 && day < 6 && day > 0) day++;

  if (negative)
    return {
      day: -day,
      week: -week,
    };
  return {
    day,
    week,
  };
}
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
function subtractDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function sendPN(tokens, title, data, body, image = '') {
  const serverKey =
    'AAAAbgfq2c0:APA91bFWPGrDCqdBdaa4qr7Py38v4ke6h4BFjP9WtS2dsWDjeKLM46S8pgqhCCdwfe2V44flQHTcXEJXFcOsCVB13xJ1lZDrh2-RJ7k-J_j4w1IuZri3WgEz6YPr2z1KXG8dFDptlyA9';
  tokens.map((device_token: UserDeviceTokenEntity) => {
    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization: 'key=' + serverKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: device_token.push_token,
        priority: 'high',
        content_available: true,
        notification: {
          title: title,
          body: body,
          image: image,
          sound: 'default',
          badge: '0',
          alert: 'New',
        },
        data: data,
      }),
    })
      .then(function (response) {
        //console.log(response);
      })
      .catch(function (error) {
        console.error(error);
      });
  });
}
function convertMinutes(num) {
  const d = Math.floor(num / 1440); // 60*24
  const h = Math.floor((num - d * 1440) / 60);
  const m = Math.round(num % 60);

  if (d > 0) {
    return d > 1 ? d + ' days' : d + ' day';
  } else if (h > 0) {
    return h > 1 ? h + ' hours' : h + ' hour';
  } else {
    return m > 1 ? m + ' minutes' : m + ' minute';
  }
}

function enumerateEnum(enumType) {
  return Object.keys(enumType).filter((i) => isNaN(Number(i)));
}

function safeAssign(source: object, target: object, fields: string[]) {
  fields.forEach((k) => {
    if (k in source) {
      target[k] = source[k];
    }
  });
}
export {
  safeAssign,
  enumerateEnum,
  asyncForEach,
  asyncMap,
  getPercentageChange,
  validateDates,
  lowerFirstLetter,
  upperFirstLetter,
  // checkUnit,
  // convertAndFormat,
  succesResponse,
  convertMS,
  addDays,
  subtractDays,
  sendPN,
  convertMinutes,
};
