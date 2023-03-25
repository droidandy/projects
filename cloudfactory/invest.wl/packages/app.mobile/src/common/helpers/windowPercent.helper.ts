import { Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

// reserved для высчитывания % внутри блоков с padding/margin
export function windowWidthPercent(percent: number, reserved: number = 0): number {
  return Math.floor(percent / 100 * (deviceWidth - reserved));
}

// reserved для высчитывания % внутри блоков с padding/margin
export function windowHeightPercent(percent: number, reserved: number = 0): number {
  return Math.floor(percent / 100 * (deviceHeight - reserved));
}
