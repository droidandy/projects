import React from 'react';
import { Box, Img, Typography } from '@marketplace/ui-kit';
import { Link } from 'components/Link';
import { useStyles, FaceType } from './ServiceItem.styles';

interface IServiceItemProps {
  title?: string;
  href: string;
  source?: string;
  text?: string;
  face?: FaceType;
}

export const ServiceItem = React.memo(({ title, text, href, source, face = FaceType.PRIMARY }: IServiceItemProps) => {
  const s = useStyles({ face });
  const isPrimary = face === FaceType.PRIMARY;
  return (
    <Link href={href} underline="none">
      <Box className={s.container}>
        <Img src={source} alt={title || ''} />
        <Box className={s.content}>
          {title && <Typography variant={isPrimary ? 'h4' : 'h2'}>{title}</Typography>}
          {text && <Typography variant={isPrimary ? 'h6' : 'h5'}>{text}</Typography>}
        </Box>
      </Box>
    </Link>
  );
});

export { FaceType };
