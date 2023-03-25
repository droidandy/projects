import {} from '@marketplace/ui-kit/types';
import { Video } from '@marketplace/ui-kit/types/Video';
import { VideoDTO } from 'types/dtos/video.dto';

export const VideoMapper = <T>(item: T, dto: VideoDTO): T & Video => {
  return {
    ...item,
    videoUrl: dto.video_url,
  };
};

export const VideoMapperNew = <T>(item: T, dto: any): T & Video => {
  return {
    ...item,
    videoUrl: dto.videoUrl,
  };
};
