import React from 'react';

import { Link } from 'components/Link';
import { Img, Typography } from '@marketplace/ui-kit';
import { BlogPost } from '@marketplace/ui-kit/types';

import { formatFromTimestamp } from 'helpers/formatFromTimestamp';

import { useStyles } from './PostCard.styles';

interface Props {
  post: BlogPost;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export const PostCard = ({ post, target }: Props) => {
  const classes = useStyles();
  const href = `https://blog.bankauto.ru/${post.category?.alias}/${post.alias}`;

  return (
    <Link href={href} target={target}>
      <a>
        <div className={classes.postCardWrapper}>
          <div className={classes.imageWrapper}>
            <Img aspect="3/2" src={post.images['500']} alt="image" />
          </div>
          <div className={classes.metaWrapper}>
            <span className={classes.category}>{post.category?.name}</span>
            <span className={classes.date}>
              {formatFromTimestamp(
                post.createdAt ?? post.publishedAt ?? post.updatedAt ?? new Date().getTime(),
                'dd MMMM yyyy',
              )}
            </span>
          </div>
          <Typography className={classes.title} variant="h5">
            {post.name}
          </Typography>
        </div>
      </a>
    </Link>
  );
};
