import axios from 'axios';

export const getBase64Img = async (url: string) => {
  const { data } = await axios.get(url, {
    responseType: 'arraybuffer',
  });
  const base64 = await Buffer.from(data, 'binary').toString('base64');
  return base64;
};
