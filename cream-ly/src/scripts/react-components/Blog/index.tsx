import React from "react";
import uniq from 'lodash/uniq';
import { connect } from "@Components/index";
import { useTranslate } from "@Core/i18n";
import Header from "@Components/Structure/Header";
import Pagination from '@material-ui/lab/Pagination';
import MessageUs from "@Components/SharedComponents/MessageUs";
import PromoAdvantages from "@Components/SharedComponents/PromoAdvantages";
import { paginate, updateFilterParams, getFilterParam } from "./actions";
import Promo from "./sections/promo";
import Preview from './sections/preview';
import Tags from './sections/tags';

import { PostProps } from './types';

import "./index.scss";

interface BlogProps {
  articles: PostProps[];
  tags: string[];
  lang: string;
}

const defaultTranslationKeys = {};

const Blog = ({ articles, tags, lang = "ru" }: BlogProps) => {
  const t = useTranslate("Blog", lang, defaultTranslationKeys);

  const [tagFilter, setTagFilter] = React.useState(getFilterParam("filter", "все"));
  const [pageNumber, setPageNumber] = React.useState(getFilterParam("pageNumber", "1"));

  const handleSetTagFilter = (tagName: string) => {
    const newTagFilter = tagFilter === tagName ? "все" : tagName;
    updateFilterParams({ filter: newTagFilter, pageNumber: "1" });
    setTagFilter(newTagFilter);
    setPageNumber("1");
  };

  const filteredArticles =
    tagFilter && tagFilter !== "все"
      ? articles.filter((item) => item.tags.includes(tagFilter))
      : articles;

  const pageSize = parseInt(t("numberOfPostsPerPage"), 10) || 12;

  const countOfPages = Math.ceil(filteredArticles.length / pageSize);

  const pageArticles = React.useMemo(
    () => paginate(filteredArticles, pageSize, pageNumber),
    [filteredArticles, pageSize, pageNumber]
  );

  const tagCloudTitle = t("tagsCloudTitle", {}, "");

  return (
    <div className="BlogPage">
      <Header isPageHeader>{t("header")}</Header>

      {tagCloudTitle && <Header>{tagCloudTitle}</Header>}

      {articles.length > 0 && (
        <Tags tags={tags} handleClick={handleSetTagFilter} filter={tagFilter} />
      )}

      <div className="articles">
        {pageArticles.map((article) => (
          <Preview
            key={article.id}
            handleTagClick={handleSetTagFilter}
            {...article}
          />
        ))}
      </div>

      {countOfPages > 1 && (
        <Pagination
          count={countOfPages}
          size="large"
          page={parseInt(pageNumber, 10)}
          onChange={(event, value) => {
            updateFilterParams({ pageNumber: value })
            setPageNumber(value);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }}
          classes={{ root: "paginationRoot", ul: "paginationUl" }}
          variant="outlined"
          shape="rounded"
        />
      )}

      <div className="spacingBottom"></div>
      <Promo />
      <div className="spacingBottom"></div>
      <PromoAdvantages lang={lang} />
      <div className="spacingBottom"></div>
      <MessageUs lang={lang} />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    articles: ownProps.articles ? ownProps.articles : state.blog.articles,
    tags: uniq(state.blog.articles.flatMap(item => item.tags)),
  };
};

export default connect(mapStateToProps)(Blog);
