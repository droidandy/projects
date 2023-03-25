import React from "react";
import { connect } from "@Components/index";
import { useTranslate } from "@Core/i18n";
import Chip from "../../chip";
import Header from "@Components/Structure/Header";
import PageLink from "@Components/Structure/PageLink";
import Image from "@Components/SharedComponents/LazyLoadImage";
import InstagramWidget from "@Components/SharedComponents/InstagramFeedback";
import Promo from "../promo"
import { updateFilterParams } from '../../actions';

import { PostProps } from "../../types";

import "./index.scss";

interface IPost {
  article: PostProps;
  lang?: string;
}

const Post = ({ article, lang = "ru" }: IPost) => {
  const t = useTranslate("Blog", lang);

  const { contentHtml, image, tags, title } = article;

  return (
    <div className="Post">
      <div className="post-header">
        <div className="back-btn">
          <PageLink pageType="PAGE_BLOG">{t("back")}</PageLink>
        </div>
        <Header isPageHeader>{title}</Header>
      </div>

      {image && (
        <div className="post-hero">
          <Image src={image.transformedSrc} height={400} alt={title} />
        </div>
      )}

      <div className="post-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />

      <div className="tags">
        {tags.map((tag) => (
          <PageLink pageType="PAGE_BLOG" key={tag}>
            <Chip
              label={tag}
              value={{ filter: tag }}
              handleClick={updateFilterParams}
            />
          </PageLink>
        ))}
      </div>

      <div className="spacingBottom"></div>
      <Promo />
      <div className="spacingBottom"></div>
      <InstagramWidget lang={lang} />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const path = window.location.pathname;
  const getHandleFromUrl = () => {
    let handle = window.location.pathname;
    if (handle.endsWith("/")) {
      handle = path.slice(0, -1);
    }
    return handle.split("/").slice(-1)[0];
  };

  const articles = ownProps.articles ? ownProps.articles : state.blog.articles;
  const handle = ownProps.handle ? ownProps.handle : getHandleFromUrl();

  const article = articles.find((article) => article.handle === handle);
  return { article };
};

export default connect(mapStateToProps)(Post);
