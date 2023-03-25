import React, { memo, useEffect } from 'react';
import { Box, Grid, Typography, useBreakpoints, OmniLink } from '@marketplace/ui-kit';
import { BlogPostNode } from '@marketplace/ui-kit/types';
import { useBlogPosts } from 'store/blog';
import BlogItem from 'containers/Home/BlogPosts/components/BlogItem';
import { Swiper } from 'components/Swiper';

export const BlogPosts = memo(() => {
  const { posts, fetchBlogPosts, initial: initialState } = useBlogPosts();
  useEffect(() => {
    if (!initialState) {
      fetchBlogPosts();
    }
  }, [fetchBlogPosts, initialState]);

  const { isMobile } = useBreakpoints();

  return (
    <>
      <Box textAlign="center" pb={isMobile ? 2.5 : 5}>
        <OmniLink href="https://blog.bankauto.ru/" style={{ textDecoration: 'none' }}>
          <Typography component="h2" variant={isMobile ? 'h4' : 'h2'} color="textPrimary">
            #блог
          </Typography>
        </OmniLink>
      </Box>
      {isMobile ? (
        <Swiper loop slidesPerView="auto" key={Math.random()}>
          {posts?.items.map((post: BlogPostNode) => (
            <Box width="90%" position="relative" key={post.id}>
              <BlogItem
                postCreatedAt={post.publishedAt || new Date().getTime()}
                blogPostTitle={post.name}
                href={`https://blog.bankauto.ru/${post.category?.alias}/${post.alias}`}
                blogPostImage={post.images['500']}
              />
            </Box>
          ))}
        </Swiper>
      ) : (
        <Grid container spacing={5}>
          {posts?.items.map((post: BlogPostNode) => (
            <Grid item xs={12} sm={3} key={post.id}>
              <BlogItem
                blogPostImage={post.images['500']}
                postCreatedAt={post.publishedAt || new Date().getTime()}
                blogPostTitle={post.name}
                href={`https://blog.bankauto.ru/${post.category?.alias}/${post.alias}`}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
});
