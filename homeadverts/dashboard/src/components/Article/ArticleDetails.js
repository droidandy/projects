import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { FavoriteBorder, Favorite, PhotoLibrary } from '@material-ui/icons';
import { likeStory } from 'service/story/story';

class ArticleDetails extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    likeStory: PropTypes.func.isRequired,
  };

  render() {
    const { data: { article }, likeStory } = this.props;

    return (
      <div className="articleDetails">
        <div
          className="picture cover"
          style={{ background: `url(${article?.thumbnail.l})` }}
        >
          <div className="fullscreen">
            <PhotoLibrary />
          </div>
        </div>
        <div className="shortInfo">
          {article?.topic ? (
            <a href={article?.url.topic} className="category">
              {article?.topic.displayName}
            </a>
          ) : ''}
          <a href={article?.url.details} className="title">
            {article?.title}
          </a>
          <p className="intro">
            {article?.intro}
          </p>
        </div>

        <div className="actions">
          <div className="like">
            <IconButton className="likeButton" onClick={() => likeStory(article)}>
              {article?.isLiked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            {article?.likesCount ? (
              <span className="label">Likes ({article.likesCount})</span>
            ) : (
              <span className="label">Like</span>
            )}
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = ({ story }) => ({ stories: story?.collection });

const mapDispatchToProps = { likeStory };

export default connect(mapStateToProps, mapDispatchToProps)(ArticleDetails);
