import React, {Fragment, useState} from 'react';
import { useQuery } from '@apollo/react-hooks';
import { connect } from "react-redux";
import ReactMarkdown from 'react-markdown';
import Swiper from "react-id-swiper";
import {
  BlogItemContainer,
  BlogItemImage,
  BlogItemSliderContainer,
  HugeTitle,
  Section,
  BlogItemContent,
  BlogItemHeader,
  BlogItemHeaderContent,
  AveragePrice,
  Text,
  SmallButtonLeft
} from '../../components/blog/styles';
import { Title } from '../../../../components/texts/title_with_subtitle/styles';
import Body from "../../components/body";
import { useParams } from 'react-router-dom';
import { BlogCard } from '../../components/blog/blogCard';
import { getBlogItemQuery } from './gqlQueries';

import "./swiper.css";
import { clientBlog } from '../../../../application/utils/apollo_client';
import Helmet from "react-helmet";

export const BlogItemView = ({ general: { isMobile }}) => {
	const [swiper, updateSwiper] = useState(null);
  const { id } = useParams();
  const { data, error, loading } = useQuery(getBlogItemQuery(id), { client: clientBlog });

  const blog = data ? data.blog : null;
  const blogs = data ? data.blogs.filter(x => x.id != blog.id) : [];

  const renderBlogItem = () => {
    let swiperParams;
    if (isMobile) {
      swiperParams = {
        resistanceRatio: 0,
        slidesPerView: 1,
        spaceBetween: 15,
        simulateTouch: true,
        pagination: {
          el: ".swiper-pagination",
          type: "bullets",
          clickable: true
        }
      };
    } else {
      swiperParams = {
        resistanceRatio: 0,
        slidesPerView: 3,
        spaceBetween: 24,
        simulateTouch: true,
        slideClass: 'custom-blog-swiper',
        containerClass: 'custom-blog-swiper-container'
      };
    }

    console.log("blooooog:", blog, "bloooggggs:", blogs);

    if (blog) {
      const el = document.querySelector("meta[name='description']");
      el.setAttribute('content', blog.Article.substring(0, 159))
    }

    return blog &&
      <Fragment>
        <Helmet>
          <title>{"TaxGig Inc. - "} {blog.title}</title>
        </Helmet>
        <Section>
          <BlogItemContainer isComplex={!!blog.average_price}>
            <BlogItemHeader isComplex={!!blog.average_price}>
              <BlogItemHeaderContent>
                <HugeTitle>{blog.title}</HugeTitle>
                {
                  blog.average_price && <>
                    <AveragePrice>{blog.average_price}</AveragePrice>
                    <Text>Average price</Text>
                    {
                      blog.request_link && blog.request_link.length > 0 &&
                      <a style={{"textDecoration": "none"}} href={blog.request_link}><SmallButtonLeft>Request a service</SmallButtonLeft></a>
                    }
                  </>
                }
              </BlogItemHeaderContent>
              <BlogItemImage src={`/api${blog.photo_main.url}`} />
            </BlogItemHeader>
            <BlogItemContent>
              <ReactMarkdown source={blog.Article} />
            </BlogItemContent>
          </BlogItemContainer>
        </Section>
        <Title>You might also like</Title>
        <BlogItemSliderContainer>
          <Swiper getSwiper={updateSwiper} {...swiperParams}>
            {
              blogs.map(
                ({ id, title, photo_preview: { url }, blog_category}) =>
                  <div key={id}>
                    <BlogCard id={id} imageSrc={`https://landing.taxgig.com/api${url}`} title={title} category={blog_category.title} />
                  </div>
              )
            }
          </Swiper>
        </BlogItemSliderContainer>
      </Fragment>;
  }

  return <Body children={renderBlogItem()} />;
}

const mapStateToProps = state => ({
	general: state.general
});

export default connect(mapStateToProps)(BlogItemView);
