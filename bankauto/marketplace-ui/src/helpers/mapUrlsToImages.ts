import { Image } from '@marketplace/ui-kit/types';

export const mapUrlsToImages = (urls: string[] = []): Image[] =>
  urls.map((url) => ({
    url,
    id: url,
  }));
