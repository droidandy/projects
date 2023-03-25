import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Dropdown, Menu } from 'antd';
import CN from 'classnames';
import { ResponsiveTable, notification, Phone, confirm } from 'components';
import gettAnalytics from 'utils/gettAnalytics';
import { bindModalState } from 'components/form';
import FavoriteAddressForm from './FavoriteAddressForm';
import css from './style.css';

const locale = { emptyText: 'You haven\'t added any favourites yet.' };

export default class FavoriteAddresses extends PureComponent {
  static propTypes = {
    passengerId: PropTypes.string,
    favoriteAddresses: PropTypes.arrayOf(PropTypes.object),
    saveFavoriteAddress: PropTypes.func,
    destroyFavoriteAddress: PropTypes.func,
    companyName: PropTypes.string,
    memberId: PropTypes.number
  };

  state = {};

  sendAnalyticsEvent = (eventType, data) => {
    const { passengerId: userId, companyName, memberId: bookerId } = this.props;
    gettAnalytics(`company_web|passengers|edit|favourite_addresses|${eventType}_address`, { userId, companyName, bookerId, data });
  };

  showForm(record = { pickupMessage: '', destinationMessage: '' }) {
    this.setState({ formVisible: true, form: record });
  }

  saveForm = (record, form) => {
    this.sendAnalyticsEvent(record.id ? 'edit' : 'new', record);
    this.props.saveFavoriteAddress(this.props.passengerId, record)
      .then(() => this.closeForm())
      .catch(e => form.setErrors(e.response.data.errors));
  };

  closeForm = () => {
    this.setState({ formVisible: false, form: {} });
  };

  destroyRecord(record) {
    const { name } = record;

    confirm({
      title: `Delete Favorite Address ${name}`,
      content: 'Are you sure?',
      onOk: () => {
        this.sendAnalyticsEvent('delete', record);
        this.props.destroyFavoriteAddress(this.props.passengerId, record.id)
          .then(() => notification.success('Favorite Address has been deleted'));
      }
    });
  }

  dropdownMenu = record => (
    <Menu>
      <Menu.Item key="menuShowForm">
        <a onClick={ () => this.showForm(record) }>
          Edit
        </a>
      </Menu.Item>
      <Menu.Item key="menuDeleteNotification">
        <a onClick={ () => this.destroyRecord(record) }>
          Delete
        </a>
      </Menu.Item>
    </Menu>
  )

  mobileColumns(phone) {
    return (
      [
        { title: 'Details',
          key: 'details',
          render: record => (
            <div>
              <div className={ css.detailsItem }>
                <span className={ CN(css.detailsName, 'bold-text', 'mr-5') }>Name:</span>
                <span>{ record.name }</span>
              </div>
              <div className={ css.detailsItem }>
                <span className={ CN(css.detailsName, 'bold-text', 'mr-5') }>Address:</span>
                <span>{ record.address.line }</span>
              </div>
              <div className={ css.detailsItem }>
                <span className={ CN(css.detailsName, 'bold-text', 'mr-5') }>Pickup Message:</span>
                <span>{ record.pickupMessage }</span>
              </div>
              <div className={ css.detailsItem }>
                <span className={ CN(css.detailsName, 'bold-text', 'mr-5') }>Destination Message:</span>
                <span>{ record.destinationMessage }</span>
              </div>
            </div>
          )
        },
        { title: 'Action',
          key: 'action',
          render: record => (
            phone
            ? <Dropdown
                overlay={ this.dropdownMenu(record) }
                trigger={ ['click'] }
                placement="bottomRight"
              >
                <a className={ CN(css.dropdownButton, 'dots-dropdown-trigger') } href="#">...</a>
              </Dropdown>
            : <div>
                <Button
                  className="mr-10 actionButton"
                  type="secondary"
                  onClick={ () => this.showForm(record) }
                >
                  Edit
                </Button>
                <Button
                  className="actionButton"
                  type="danger"
                  onClick={ () => this.destroyRecord(record) }
                >
                  Delete
                </Button>
              </div>
          )
        }
      ]
    );
  }

  render() {
    const { favoriteAddresses } = this.props;
    const { form } = this.state;

    return (
      <div>
        { favoriteAddresses.length < 10 &&
          <div className={ CN('layout horizontal end-justified', css.actionButtons) }>
            <Button className="mobileButton" type="primary" onClick={ () => this.showForm() }>
              <Phone>
                { match => (
                    match
                    ? '+'
                    : 'Add address'
                  )
                }
              </Phone>
            </Button>
          </div>
        }

        <ResponsiveTable
          pagination={ false }
          className="sm-mt-20"
          locale={ locale }
          rowKey="id"
          dataSource={ favoriteAddresses }
          columns={ [
            { title: 'Name', dataIndex: 'name', key: 'name', width: '15%' },
            { title: 'Address', dataIndex: 'address.line', key: 'address', width: '25%' },
            { title: 'Pickup Message', dataIndex: 'pickupMessage', key: 'pickupMessage', width: '15%' },
            { title: 'Destination Message', dataIndex: 'destinationMessage', key: 'destinationMessage', width: '15%' },
            { title: 'Action',
              width: '30%',
              render: record => (
                <div>
                  <Button
                    className="mr-10 actionButton"
                    type="secondary"
                    onClick={ () => this.showForm(record) }
                  >
                    Edit
                  </Button>
                  <Button
                    className="actionButton"
                    type="danger"
                    onClick={ () => this.destroyRecord(record) }
                  >
                    Delete
                  </Button>
                </div>
              )
            }
          ] }
          tabletColumns={ this.mobileColumns(false) }
          mobileColumns={ this.mobileColumns(true) }
        />

        <FavoriteAddressForm
          { ...bindModalState(this) }
          width={ 720 }
          title={ form && form.id ? `Edit Favourite Address #${form.id}` : 'New Favourite Address' }
          onRequestSave={ this.saveForm }
          onRequestClose={ this.closeForm }
        />
      </div>
    );
  }
}
