const mapPaths = {
  '1.0': '1',
  '2.0': '2',
  '3.0': '3',
  '4.0': '4',
  '5.0': '5',
  '6.0': '6',
  '7.0': '7',
  '8.0': '8',
  '9.0': '9',
  '10.0': '10',
  '11.0': '11',
  '12.0': '12',
  '13.0': '13',
  '14.0': '14',
};

export const getPath = (originalPath: string) => String(mapPaths[originalPath] || originalPath);
