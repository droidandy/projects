import Papa from 'papaparse';

export default async (file, config = {}) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      transformHeader(v) {
        return v;
      },
      ...config,
      complete(results, f) {
        resolve(results, f);
      },
      error(err) {
        reject(err);
      },
    });
  });
};
