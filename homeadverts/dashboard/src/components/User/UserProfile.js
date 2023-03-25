import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { followUser } from 'service/user/user';
import { UserPhoto, UserProfileDetails } from 'components';

class UserProfile extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    followUser: PropTypes.func.isRequired,
  };

  get data() {
    const { data: { admin } } = this.props;
    return { ...admin, photo: admin?.thumbnail?.xs };
  }

  render() {
    const { data: { admin }, me, followUser } = this.props;
    const isMe = me.id === admin.id;
    return (
      <div className="userProfile">
        <div className="userPreview">
          <UserPhoto data={this.data} size={75} />
          <div className="data">
            <a href={admin?.url?.details} className="name">{admin?.name}</a>
            {admin?.company && <p className="company">{admin.company}</p>}
            <div className="actions">
              {!isMe && (
                <Button
                  size="small"
                  disableRipple
                  variant="outlined"
                  onClick={() => followUser(admin)}
                  className="follow"
                >
                  {admin?.isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
          </div>
        </div>
        <UserProfileDetails data={admin} />
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({ me: user?.me });

const mapDispatchToProps = { followUser };

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
