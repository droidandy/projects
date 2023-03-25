import React, { useState } from 'react';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { useBreakpoints } from '@marketplace/ui-kit';
import { useStyles } from './YoutubeEmbedded.styles';

type YoutubeEmbeddedProps = {
  title: string;
  videoId: string;
};

export const YoutubeEmbedded = ({ title, videoId }: YoutubeEmbeddedProps) => {
  const s = useStyles();
  const [preview, setPreview] = useState<boolean>(true);

  const handlePreviewClick = () => {
    setPreview(false);
  };

  const { isMobile } = useBreakpoints();
  const imageSrc = isMobile ? '/images/adsFuel/imageHowMobile.webp' : '/images/adsFuel/imageHow.webp';
  return preview ? (
    <ImageWebpGen className={s.preview} src={imageSrc} alt={title} onClick={handlePreviewClick} />
  ) : (
    <iframe
      width="100%"
      height="100%"
      title={title}
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};
