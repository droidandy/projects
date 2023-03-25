import React from 'react';
import {Link} from 'react-router-dom';
import {BlogCardContainer, ImageWrap, BlogCardCategory, BlogCardTitle} from './styles';

export const BlogCard = ({id, imageSrc, category, title}) =>
    <Link style={{"color":"inherit", "textDecoration": "none"}} to={`/blog/${id}`}>
        <BlogCardContainer>
            <ImageWrap>
                <img src={imageSrc} className="image"/>
            </ImageWrap>
            <BlogCardCategory>{category}</BlogCardCategory>
            <BlogCardTitle>
                <span className="blog-link">{title}</span>
            </BlogCardTitle>
        </BlogCardContainer>
    </Link>;

