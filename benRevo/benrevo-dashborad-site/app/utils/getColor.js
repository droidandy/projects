import colors from './colors';

export const getColor = (value) => {
  if (value > 6 && value <= 10) return colors[2];
  else if (value >= 0 && value <= 6) return colors[1];
  else if (value < 0) return colors[0];
  else if (value > 10 && value <= 20) return colors[3];
  else if (value > 20) return colors[4];

  return '#FF0000';
};

export const getColorByRange = (value, ranges) => {
  const leftColors = [colors[4], colors[3]];
  const rightColors = [colors[2], colors[1], colors[0]];
  let center = 0;
  let finalColor = '#FF0000';

  if (ranges.length > 1) {
    for (let j = 0; j < ranges.length; j += 1) {
      const range = ranges[j];

      if (range[0] === 0) {
        center = j;
        break;
      }
    }

    for (let l = 0; l < center; l += 1) {
      const range = ranges[l];
      let colorIndex = l;

      if (colorIndex === center - 1) {
        colorIndex = 1;
      } else colorIndex = 0;

      if (value >= range[0] && value <= range[1]) {
        finalColor = leftColors[colorIndex];
      }
    }

    for (let k = center; k < ranges.length; k += 1) {
      const range = ranges[k];
      let colorIndex = k - center;

      if (colorIndex >= 3) {
        colorIndex = rightColors.length - 1;
      }

      if (value >= range[0] && value < range[1]) {
        finalColor = rightColors[colorIndex];
      }
    }
  } else if (ranges[0][1] > 0) finalColor = colors[4];
  else if (ranges[0][0] < 0) finalColor = colors[1];

  return finalColor;
};

export const getColorSimple = (value) => {
  let finalColor = null;

  if (value < 0) finalColor = colors[1];
  else finalColor = colors[4];
  return finalColor;
};

export const getColorProbability = (value) => {
  let finalColor = null;

  if (value === 'HIGH') finalColor = colors[0];
  else if (value === 'LOW') finalColor = colors[4];
  else if (value === 'MEDIUM') finalColor = colors[3];

  return finalColor;
};

export default getColor;
