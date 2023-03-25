import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from '@material-ui/core';
import { connect } from 'react-redux';
import { drawerHideAction } from 'action/nav';

class EditorDrawer extends React.Component {
  static propTypes = {
    nav: PropTypes.object.isRequired,
    drawerHideAction: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  hideDrawer = () => {
    const { drawerHideAction } = this.props;
    drawerHideAction('editor');
  };

  render() {
    const { nav } = this.props;

    return (
      <Drawer id="drawer" anchor="right" open={nav.open === 'editor'} onClose={this.hideDrawer}>
        <div
          tabIndex={0}
          role="button"
          onClick={this.hideDrawer}
          onKeyDown={this.hideDrawer}
        >
          <div id="sideNav">
            <div className="heading">Editor</div>
          </div>
        </div>
      </Drawer>
    );
  }
}

const mapStateToProps = ({ nav, user: { me } }) => ({ nav, me });

const mapDispatchToProps = { drawerHideAction };

export default connect(mapStateToProps, mapDispatchToProps)(EditorDrawer);
