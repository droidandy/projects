/**
 * Генерирует размеры для элементов/отступов по сетке с заданным шагом. Работает только с числами
 * Использовать нужно в виде:
 * @example theme.sizing(2) // 16
 * @example theme.sizing(0.5) // 4
 *
 * @param {number} multiplier - множитель для шага сетки
 * @returns {number} посчитанные размеры для указанного множителя
 */
const sizing = (multiplier: number): number => multiplier * 8;

export const theme = {
  white: '#FFFFFF',
  green: '#328A27',
  grayedGreen: '#797A79',
  border: '#e4e4e4',
  black: `#000`,
  darkGray: '#353535',
  gray: '#707070',
  grayText: '#464646',
  grayDisabled: '#999999',
  lightGray: '#c9c9cb',
  placeholder: '#555',
  veryLightGray: 'rgba(69,69,69,0.11)',
  lightenGray: 'rgba(112,112,112,.05)',
  pharmacy: {
    red: '#C1001019',
    nearest: '#40D3D819',
    cheapest: '#D8A14019',
    redText: '#C10010',
    nearestText: '#40D3D8',
    cheapestText: '#D8A140',
  },
  red: '#f00',
  error: '#AA7777',
  gradient: ['#ffffff', '#ffffff', '#f6f6f6'],
  gradientLight: ['rgba(255, 255, 255, 0)', 'rgba(128, 128, 128, 1)'],
  gradientLightColor: '#fff',
  gradientDarkColor: '#f6f6f6',
  fonts: {
    normal: 'sf-ui-text',
    light: 'sf-ui-text-light',
    productHeading: 'sf-pro-semi',
  },
  logoMarginTop: 110,
  screenPadding: {
    horizontal: sizing(2),
    vertical: sizing(2),
    space: sizing(2),
  },
  opacity: {
    active: 0.25,
  },
  sizing,
};

export const iconFillStyle = (active = false) => {
  return !active ? { fill: '#8E8E93', fillOpacity: '0.48' } : { fill: '#328A27', fillOpacity: '1' };
};
