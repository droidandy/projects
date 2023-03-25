import axios from 'axios';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import stat from './stat';

const BUCKET_NAME = process.env.APEX_EXTEND_LOGOS_AWS_S3_BUCKET_NAME;
const AWS_CLOUDFRONT_URL = process.env.APEX_EXTEND_LOGOS_AWS_CLOUDFRONT_URL;
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.APEX_EXTEND_LOGOS_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.APEX_EXTEND_LOGOS_AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.APEX_EXTEND_LOGOS_AWS_REGION,
});

const fetchImage = async (imageUrl: string | null) => {
  stat.s.apiRequests.images++;
  const image = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  return Buffer.from(image.data);
};

export const saveToStorage = async (instId: BigInt, tag: string, imageUrl: string | null) => {
  if (!imageUrl) {
    return {
      [tag]: null,
    };
  }

  const Key = `${instId}/${tag}.png`;
  const params = {
    Bucket: BUCKET_NAME,
    Key,
    Body: await fetchImage(imageUrl),
  };

  await s3Client.send(new PutObjectCommand(params));

  return {
    [tag]: AWS_CLOUDFRONT_URL + Key,
  };
};
