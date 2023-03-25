import * as React from 'react';
import { Box, Grid, Typography } from '@marketplace/ui-kit';
import { formatFromTimestamp } from 'helpers';
import { Link } from 'components/Link';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { useStyles } from './BlogItem.styles';

interface IBlogItemProps {
  postCreatedAt: number;
  blogPostTitle: string;
  href: string;
  blogPostImage: string | undefined;
}

const BlogItem = (props: IBlogItemProps) => {
  const { postCreatedAt, blogPostTitle, href, blogPostImage } = props;
  const s = useStyles();
  return (
    <Link href={href} underline="none">
      <Grid container direction="column" justify="center">
        <Grid item className={s.imageContainer}>
          <ImageWebpGen src={blogPostImage} alt={blogPostTitle} />
        </Grid>
        <Box pt={0.625}>
          <Typography variant="overline" component="span" color="primary">
            Новости
          </Typography>
          <Typography variant="overline" component="span" color="secondary" style={{ marginLeft: '.625rem' }}>
            {formatFromTimestamp(postCreatedAt, 'dd MMMM yyyy')}
          </Typography>
        </Box>
        <Box pt={0.625}>
          <Typography variant="subtitle1" color="textPrimary">
            {blogPostTitle}
          </Typography>
        </Box>
      </Grid>
    </Link>
  );
};
export default BlogItem;
