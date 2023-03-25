import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Drawer, List, Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {
  Tune,
  Help,
  ExitToApp,
  AccountCircle,
  Book,
  Create,
  CreditCard,
  ShowChart,
  InboxOutlined,
  Drafts,
  CloudDownload,
} from '@material-ui/icons';
import route from 'config/route';
import { UserPhoto } from 'components';

const styles = {
  icon: {
    marginRight: 0,
    marginLeft: 5,
  },
};

class NavDrawer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool,
    data: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    open: false,
  };

  hideDrawer = () => {
    const { onClose } = this.props;
    onClose('nav');
  };

  render() {
    const { classes, data, open } = this.props;

    return (
      <Drawer id="drawer" anchor="right" open={open} onClose={this.hideDrawer}>
        <div
          tabIndex={0}
          role="button"
          onClick={this.hideDrawer}
          onKeyDown={this.hideDrawer}
        >
          <div id="sideNav">
            <div className="userHeader">
              <UserPhoto data={{ ...data, photo: data?.thumbnail?.xs }} />
              {data?.name && <span>{data.name}</span>}
            </div>

            <List>
              <ListItem button component="a" href={route.URL_STREAM}>
                <ListItemIcon className={classes.icon}>
                  <Book />
                </ListItemIcon>
                <ListItemText primary="For You" />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button component="a" href={route.URL_STORY_NEW}>
                <ListItemIcon className={classes.icon}>
                  <Create />
                </ListItemIcon>
                <ListItemText primary="Write" />
              </ListItem>
              <ListItem button component="a" href={route.URL_PROFILE}>
                <ListItemIcon className={classes.icon}>
                  <InboxOutlined />
                </ListItemIcon>
                <ListItemText primary="My Stories" />
              </ListItem>
              <ListItem button component="a" href={route.URL_PROFILE}>
                <ListItemIcon className={classes.icon}>
                  <Drafts />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
              </ListItem>
              <ListItem button component="a" href={route.URL_STORY_IMPORT}>
                <ListItemIcon className={classes.icon}>
                  <CloudDownload />
                </ListItemIcon>
                <ListItemText primary="Story Import" />
              </ListItem>
            </List>
            <Divider />
            <List>
              {data?.id && (
                <ListItem button component="a" href={`${route.URL_PROFILE}/${data.id}`}>
                  <ListItemIcon className={classes.icon}>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItem>
              )}
              <ListItem button component="a" href={route.URL_SETTINGS}>
                <ListItemIcon className={classes.icon}>
                  <Tune />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
              <ListItem button component="a" href={route.URL_BILLING}>
                <ListItemIcon className={classes.icon}>
                  <CreditCard />
                </ListItemIcon>
                <ListItemText primary="Billing" />
              </ListItem>
              <ListItem button component="a" href={route.URL_STATISTICS}>
                <ListItemIcon className={classes.icon}>
                  <ShowChart />
                </ListItemIcon>
                <ListItemText primary="Statistics" />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button component="a" href={route.URL_HELP}>
                <ListItemIcon className={classes.icon}>
                  <Help />
                </ListItemIcon>
                <ListItemText primary="Help" />
              </ListItem>
              <ListItem button component="a" href={route.URL_LOGOUT}>
                <ListItemIcon className={classes.icon}>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </ListItem>
            </List>
          </div>
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(NavDrawer);
