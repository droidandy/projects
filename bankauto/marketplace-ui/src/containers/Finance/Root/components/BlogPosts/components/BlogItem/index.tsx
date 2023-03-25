import * as React from 'react';
import { Box, Img, Typography } from '@marketplace/ui-kit';
import { Link } from 'components/Link';
import { useStyles } from './BlogItem.styles';

interface IBlogItemProps {
  blogPostTitle?: string;
  href: string;
  blogPostImage?: string;
  height?: string;
}

const BlogItem = (props: IBlogItemProps) => {
  const { blogPostTitle, href, blogPostImage, height } = props;
  const s = useStyles();
  return (
    <Link href={href} underline="none" target="_blank">
      <Box className={s.imageContainer} style={{ height }}>
        <Img src={blogPostImage} alt={blogPostTitle} />
        <Typography variant="subtitle1" className={s.title}>
          {blogPostTitle}
        </Typography>
      </Box>
    </Link>
  );
};
export default BlogItem;
