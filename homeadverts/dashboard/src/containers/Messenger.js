import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Conversations, CurrentConversation } from 'containers';
import { Desktop, Tablet, UserPhoto, IconBtn } from 'components';
import { roomUnSelectAction } from 'action/room';
import { sidebarShowAction } from 'action/nav';
import { nav } from 'type';

class Messenger extends Component {
  static propTypes = {
    sidebarShowAction: PropTypes.func.isRequired,
    sidebar: PropTypes.string.isRequired,
    roomUnSelectAction: PropTypes.func.isRequired,
    roomSelected: PropTypes.object,
  };

  static defaultProps = {
    roomSelected: null,
  };

  renderColumns = isDesktop => (
    <Fragment>
      <Conversations isDesktop={isDesktop} />
      {isDesktop && <CurrentConversation isDesktop={isDesktop} />}
    </Fragment>
  );

  render() {
    const {
      roomSelected,
      roomUnSelectAction,
      sidebar,
      sidebarShowAction,
    } = this.props;
    // @todo remove to another component
    return (
      <div className="container">
        <Tablet>
          {roomSelected?.id && sidebar === nav.sideBar.profile && (
            <header className="header">
              <div className="contentBar">
                <div className="contentLeft">
                  <IconBtn onClick={roomUnSelectAction} />
                </div>
                <UserPhoto
                  data={{ ...roomSelected?.admin, photo: roomSelected?.admin?.thumbnail?.xs }}
                  size={40}
                />
              </div>
            </header>
          )}
          {sidebar === nav.sideBar.details && (
            <header className="header">
              <div className="contentBar">
                <div className="contentLeft">
                  <IconBtn onClick={() => sidebarShowAction(nav.sideBar.profile)} />
                </div>
              </div>
            </header>
          )}
        </Tablet>
        <section className="content">
          <div className="columns">
            <Desktop>
              {this.renderColumns}
            </Desktop>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = ({ room, nav }) => ({
  roomSelected: room?.selected,
  sidebar: nav?.sidebar,
});

const mapDispatchToProps = {
  roomUnSelectAction,
  sidebarShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);
