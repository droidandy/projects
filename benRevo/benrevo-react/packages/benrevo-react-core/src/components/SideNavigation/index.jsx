import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import { Menu, Accordion } from 'semantic-ui-react';

class PresentationNavigation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    slotTop: PropTypes.func,
    slotBottom: PropTypes.func,
    modalAction: PropTypes.func,
    navigation: PropTypes.object.isRequired,
    urlPrefix: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
  };
  state = {
    activeIndex: 0,
    activeSubMenuIndex: 0,
  }

  componentWillMount() {
    const params = this.props.location.pathname.split('/');
    this.setState({
      activeIndex: params[3],
      activeSubMenuIndex: params.splice(3).join('/'),
    });
  }

  componentWillReceiveProps(nextProps) {
    const { pathname: thisPath } = this.props.location;
    const { pathname: nextPath } = nextProps.location;
    if (thisPath !== nextPath) {
      const params = nextPath.split('/');
      this.setState({
        activeIndex: params[3],
      });
    }
  }

  handleClick = (e, index) => {
    if (e.target.id !== 'accordion-title') {
      return;
    }
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? null : index;

    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { navigation, urlPrefix, clientName, slotTop, slotBottom } = this.props;
    const majorMenu = navigation.major;
    const minorMenu = navigation.minor;
    const { activeIndex } = this.state;

    return (
      <div className="side-navigation">
        <div>
          { slotTop && slotTop() }
        </div>
        <div className="client-name">
          {clientName}
        </div>
        <Menu vertical>
          {
            majorMenu.map((item) => {
              if (item.content && !item.hidden) {
                return (
                  <Accordion key={item.id} >
                    <Menu.Item
                      className="accordion-item"
                      onClick={(e) => this.handleClick(e, item.link)}
                    >
                      <Accordion.Title
                        active={activeIndex === item.link}
                        id="accordion-title"
                        content={item.title}
                        index={item.id}
                        className={item.class}
                      ></Accordion.Title>
                      <Accordion.Content
                        active={activeIndex === item.link}
                        content={item.content.map((subItem) => {
                          if (!subItem.hidden) {
                            return (
                              <Menu.Item
                                key={subItem.id}
                                as={Link}
                                activeClassName="active"
                                className="content-item"
                                to={`${urlPrefix}/${subItem.link}`}
                              >
                                <span className="dot"></span>
                                {subItem.title}
                              </Menu.Item>
                            );
                          }

                          return null;
                        })}
                      />
                    </Menu.Item>
                  </Accordion>
                );
              } else if (!item.hidden) {
                return (
                  <Menu.Item
                    key={Math.random().toString(36).substr(2, 16)}
                    activeClassName="active"
                    className={item.class}
                    as={Link}
                    to={`${urlPrefix}/${item.link}`}
                  >
                    {item.title}
                  </Menu.Item>
                );
              }
            })
          }
        </Menu>

        { minorMenu && minorMenu.length > 0 &&
          <Menu vertical className="second-menu">
            { minorMenu.map((item, i) => {
              if (!item.modal) {
                return (
                  <Menu.Item key={i} className={item.class} as={Link} to={`${urlPrefix}/${item.link}`} activeClassName="active">{item.title}</Menu.Item>
                );
              }
              return (
                <Menu.Item key={i} className={item.class} onClick={() => { this.props.modalAction(item.link); }}>{item.title}</Menu.Item>
              );
            })}
          </Menu>
        }

        <div className="slot-bottom">
          { slotBottom && slotBottom() }
        </div>
      </div>
    );
  }
}

export default withRouter(PresentationNavigation);
