import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { Button } from 'components';
import Comment from './Comment';

import css from './styles.css';

export default class Comments extends PureComponent {
  static propTypes = {
    onAdd: PropTypes.func,
    comments: PropTypes.array,
    warning: PropTypes.string
  };

  state = {
    comment: ''
  };

  setCommentsHolderRef = c => this.commentsHolder = c;

  addComment = () => {
    this.props.onAdd(this.state.comment)
      .then(() => {
        this.setState({ comment: '' });
        // scroll down then new comment added
        this.commentsHolder.scrollTop = this.commentsHolder.scrollHeight;
      });
  };

  changeComment = (e) => {
    this.setState({ comment: e.target.value });
  };

  render() {
    const { comments, warning } = this.props;

    return (
      <div className="p-10">
        <div className={ `${css.comments} mb-30` } ref={ this.setCommentsHolderRef }>
          { comments.length
            ? comments.map(comment => <Comment key={ comment.id } comment={ comment } />)
            : <span>There are no comments yet</span>
          }
        </div>
        { warning &&
          <div className="text-12 red-text">{ warning }</div>
        }
        <div className="layout vertical">
          <Input.TextArea
            value={ this.state.comment }
            onChange={ this.changeComment }
            rows={ 4 }
            name="commentMessage"
          />
          <Button
            type="primary"
            disabled={ this.state.comment.length === 0 }
            onClick={ this.addComment }
            className="mt-40 self-center"
          >
            Add Comment
          </Button>
        </div>
      </div>
    );
  }
}
