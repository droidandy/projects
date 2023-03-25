/* eslint-disable max-len */
import { deviceWidth } from 'utils';

const width = Math.floor(deviceWidth - 30);
const height = 140;

const orderExample = id => ({
  id,
  scheduledAt: '2018-10-02T12:06:00.000+00:00',
  indicatedStatus: 'order_received',
  pickupAddress: {
    line: '125 Back Church Ln, Whitechapel, London E1 1LT, UK'
  },
  destinationAddress: {
    line: 'The O2, Peninsula Square, London SE10 0DX, UK'
  },
  staticMap: `https://maps.googleapis.com/maps/api/staticmap?maptype=roadmap&markers=anchor:center%7Cicon:https://dev.gettaxi.me/images/mobile_start_marker.png%7C51.5137862,-0.0668716&markers=anchor:center%7Cicon:https://dev.gettaxi.me/images/mobile_finish_marker.png%7C51.503038,0.0031543&path=weight:3%7Ccolor:0x2B4983FF%7Cenc:%7DglyH%60%60La%40Q%5BGaBM%7D%40CBiA%40uBDyNJcLLmKJiDh%40_K%5CuHT%7BJPoC%5EqEjAoMp%40%7DIH%7BADaC%3FgBE%7BCAgCL%7DCP%7DBf%40_ELuBHwERkNL%7BEHaGRoLBoBFcAFsACqAQmC%3FSLqAHo%40AIn%40qDV%7BAJi%40Ba%40He%40HOBSRiCZkD%60%40aF%7EAqSHyAAcA%5DgR%5BaPS%7BJCyAGcDCEACAKG%7BCCcCI%7BDK%7B%40%5DoAIa%40Em%40A%5DEYGSOKKA%7DANkANGDKR%3FNBNHRj%40%40%5ECVCz%40Y%60%40Q%7CAkAd%40_%40j%40WTKx%40QlB_%40bB%5DjBu%40ZU%60AiApAyAfAmA%60HsHt%40oAj%40sAtB_FlGoOLY%60%40k%40n%40u%40lA%7D%40f%40S&sensor=false&size=${width}x${height}`
});

// eslint-disable-next-line import/prefer-default-export
export const fakeOrders = [orderExample(1), orderExample(2), orderExample(3)];
