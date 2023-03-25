import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ArticleItem extends React.Component {
  render() {
    const { article } = this.props;

    return (
      <div className="articleItem">
        <a href={article.url.details}>
          <div
            className="picture cover"
            style={{ background: `url(${article.thumbnail.s})` }}
          />
        </a>
        <div className="data">
          <a className="title" href={article.url.details}>
            {article.title}
          </a>
        </div>
      </div>
    );
  }
}

ArticleItem.propTypes = {
  article: PropTypes.object.isRequired,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(ArticleItem);
