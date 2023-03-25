import React, { memo, useEffect, useState } from 'react';
import cx from 'classnames';
import { Box, Typography, useBreakpoints, OmniLink, Button, ContainerWrapper } from '@marketplace/ui-kit';
import { useBlogPosts } from 'store/blog';
import { Swiper } from 'components/Swiper';
import { PostCard } from 'components';
import { BlogPost } from '@marketplace/ui-kit/types';
import BlogItem from './components/BlogItem';
import { useStyles } from './BlogPosts.styles';

export const BlogPosts = memo(() => {
  const s = useStyles();
  const { posts, blogCategories, fetchBlogPosts, fetchBlogCategories } = useBlogPosts();
  const [category, setCategory] = useState<string>(blogCategories?.[0].alias || 'reviews');
  useEffect(() => {
    fetchBlogPosts(undefined, { limit: 5, isMain: true, categories: [category] });
  }, [fetchBlogPosts, category]);

  useEffect(() => {
    if (!blogCategories) {
      fetchBlogCategories();
    } else if (blogCategories?.[0].alias !== 'reviews') {
      setCategory(blogCategories?.[0].alias);
    }
  }, [fetchBlogCategories, blogCategories]);

  const { isMobile } = useBreakpoints();

  if (!posts) {
    return null;
  }

  return (
    <ContainerWrapper className={s.blogPostsContainer}>
      <Box textAlign="center">
        <OmniLink href="https://blog.bankauto.ru/" style={{ textDecoration: 'none' }} target="_blank">
          <Typography component="h2" variant={isMobile ? 'h4' : 'h2'} className={s.header}>
            #блог
          </Typography>
        </OmniLink>
      </Box>
      <Box textAlign="center" className={s.categoryContainer}>
        {blogCategories?.map(({ id, alias, name }) => (
          <Button
            key={id}
            onClick={() => setCategory(alias)}
            className={cx(s.category, { [s.active]: category === alias })}
          >
            {name}
          </Button>
        ))}
      </Box>
      {isMobile ? (
        <Swiper loop={false} slidesPerView="auto" spaceBetween={0}>
          {posts?.items.map((post) => (
            <Box width="90%" position="relative" key={post.id} mr={1.25}>
              <PostCard post={post as BlogPost} target="_blank" />
            </Box>
          ))}
        </Swiper>
      ) : (
        <Box className={s.gridContainer}>
          {posts?.items.map((post, i) => {
            const className = `gridItem${i}` as 'gridItem0' | 'gridItem1' | 'gridItem2' | 'gridItem3' | 'gridItem4';
            return (
              <Box className={s[className]} key={post.id}>
                <BlogItem
                  blogPostImage={post.images['500']}
                  blogPostTitle={post.name}
                  href={`https://blog.bankauto.ru/${post.category?.alias}/${post.alias}`}
                  height={i === 0 ? '100%' : '13.75rem'}
                />
              </Box>
            );
          })}
        </Box>
      )}
    </ContainerWrapper>
  );
});
