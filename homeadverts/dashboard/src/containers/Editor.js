import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { drawerShowAction } from 'action/nav';
import { IconBtn } from 'components';
import EditorDrawer from 'components/Nav/EditorDrawer';

class Editor extends Component {
  static propTypes = {
    drawerShowAction: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  showDrawer = () => {
    const { drawerShowAction } = this.props;
    drawerShowAction('editor');
  };

  render() {
    return (
      <div id="editor">
        <EditorDrawer />

        <div className="nav">
          <IconBtn onClick={() => drawerShowAction('nav')}>
            <Menu />
          </IconBtn>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={this.showDrawer}
            className="publish"
          >
            Publish
          </Button>
        </div>

        <div
          className="write-story"
          data-token=""
          data-get-url=""
          data-put-url=""
          data-post-url=""
          data-analyze-url=""
          data-facebook=""
          data-twitter=""
          data-linkedin=""
        >

          <div className="story-title">
            <textarea
              id="story-title"
              name="title"
              rows="1"
              defaultValue=""
              placeholder="Title"
              autoComplete="off"
            />
          </div>
          <div
            className="editable"
            data-upload-file-url=""
            data-delete-file-url=""
          />

          <div id="uploading-spinner" className="mdl-spinner mdl-js-spinner" />
        </div>

      </div>
    );
  }
}

const mapDispatchToProps = { drawerShowAction };

export default connect(null, mapDispatchToProps)(Editor);
