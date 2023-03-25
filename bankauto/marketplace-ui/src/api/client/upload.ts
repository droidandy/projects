import API from 'api/request';

function upload(file: any): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  return API.post('/v1/client/upload/vehicle-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    baseURL: process.env.CATALOG_URL,
  }).then(({ data }) => data.url);
}

export { upload };
