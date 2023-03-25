import React, {Fragment, useCallback, useEffect, useState} from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Subtitle, Title } from '../../../../components/texts/title_with_subtitle/styles';
import { CategotiesButtons } from '../../components/blog/categotiesButtons';
import { getBlogQuery, getBlogByCategoryQuery } from './gqlQueries';
import { BlogCardsWrap, SmallButton, Section } from '../../components/blog/styles';
import { BlogCard } from '../../components/blog/blogCard';
import Body from "../../components/body";
import { clientBlog } from '../../../../application/utils/apollo_client';
import Helmet from "react-helmet";

export const BlogView = () => {
  const [limit, setLimit] = useState(9);
  const [active, setActive] = useState("All");
  const [showLoadMore, setShowLoadMore] = useState(false);

  let data;
  let loading;
  let error;

  if (active !== 'All') {
    data = useQuery(getBlogByCategoryQuery(limit, active), { client: clientBlog }).data;
    loading = useQuery(getBlogByCategoryQuery(limit, active), { client: clientBlog }).loading;
    error = useQuery(getBlogByCategoryQuery(limit, active), { client: clientBlog }).error;
  } else {
    data = useQuery(getBlogQuery(limit), { client: clientBlog }).data;
    loading = useQuery(getBlogQuery(limit), { client: clientBlog }).loading;
    error = useQuery(getBlogQuery(limit), { client: clientBlog }).error;
  }


  const blogCategories = data ? data.blogCategories : [];
  const blogs = data ? data.blogs : [];

  useEffect(() => {
    setShowLoadMore(blogCategories && blogCategories.length < limit ? false : true);
  }, [limit, data]);

  const el = document.querySelector("meta[name='description']");
  el.setAttribute('content', 'Learn more about tax related strategies and latest news.');

  const renderBlog = () =>

      <Fragment>
        <Helmet>
          <title>{"TaxGig Inc. - Blog"}</title>
        </Helmet>
        <Section>
          <Title>Blog</Title>
          <Subtitle>Learn more about tax related strategies and latest news.</Subtitle>
          <CategotiesButtons active={active} setActive={setActive} categoties={blogCategories} />
          <BlogCardsWrap>
            {
              blogs.map(
                  ({ id, title, photo_preview: { url }, blog_category}) =>
                      <BlogCard imageHeight="194px" key={id} id={id} imageSrc={`https://landing.taxgig.com/api${url}`} title={title} category={blog_category.title} />
              )
            }
          </BlogCardsWrap>
          {showLoadMore && <SmallButton onClick={() => setLimit(v => v + 9)}>Load more</SmallButton>}
        </Section>
      </Fragment>;

  return <Body children={renderBlog()} />;
}
