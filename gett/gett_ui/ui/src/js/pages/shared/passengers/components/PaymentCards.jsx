import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Menu } from 'antd';
import CN from 'classnames';
import { ResponsiveTable, notification, Phone, confirm } from 'components';
import { bindModalState } from 'components/form';
import PaymentCardForm from './PaymentCardForm';
import css from './style.css';

const locale = { emptyText: 'You haven\'t added any credit cards yet.' };
const initialForm = { kind: 'business', personal: true };

export default class PaymentCards extends PureComponent {
  static propTypes = {
    passengerId: PropTypes.string,
    paymentCards: PropTypes.arrayOf(PropTypes.object),
    loading: PropTypes.bool,
    canAdd: PropTypes.bool,
    canDelete: PropTypes.bool,
    createPaymentCard: PropTypes.func,
    makeDefaultPaymentCard: PropTypes.func,
    destroyPaymentCard: PropTypes.func,
    companyPaymentTypes: PropTypes.arrayOf(PropTypes.string)
  };

  state = {
    form: initialForm
  };

  showForm() {
    this.setState({ formVisible: true, form: { kind: 'business', personal: false } });
  }

  saveForm = (record, form) => {
    const { createPaymentCard, passengerId } = this.props;
    if (!createPaymentCard) return;

    createPaymentCard(passengerId, record)
      .then(() => this.closeForm())
      .catch(data => form.setErrors(data.errors));
  };

  closeForm = () => {
    this.setState({ formVisible: false, form: initialForm });
  };

  makeDefaultRecord(record) {
    const { passengerId, makeDefaultPaymentCard } = this.props;

    makeDefaultPaymentCard(passengerId, record.id);
  }

  destroyRecord(record) {
    const { passengerId, destroyPaymentCard } = this.props;

    confirm({
      title: 'Deactivate Payment Card?',
      content: 'Are you sure?',
      onOk: () => {
        destroyPaymentCard(passengerId, record.id)
          .then(() => notification.success('Payment Card has been deactivated'));
      }
    });
  }

  dropdownMenu = record => (
    <Menu>
      <Menu.Item key="menuDefault">
        <a onClick={ () => this.makeDefaultRecord(record) }>
          Default
        </a>
      </Menu.Item>
      <Menu.Item key="menuDeactivateNotification">
        <a onClick={ () => this.destroyRecord(record) }>
          Deactivate
        </a>
      </Menu.Item>
    </Menu>
  )

  getTableColumns() {
    const columns = [
      { title: 'Default Card',
        key: 'default',
        render: record => (
          record.default
          ? <div>Default</div>
          : <Button type="secondary" className="actionButton" onClick={ () => this.makeDefaultRecord(record) }>
              Make default
            </Button>
        )
      },
      { title: 'Type', dataIndex: 'kind' },
      { title: 'Holder Name', dataIndex: 'holderName' },
      { title: 'Last 4', dataIndex: 'last4' },
      { title: 'Expiration Date',
        key: 'expiration',
        render: ({ expirationMonth, expirationYear }) => `${expirationMonth}/${expirationYear}`
      }
    ];

    if (this.props.canDelete) {
      columns.push({
        title: 'Action',
        key: 'action',
        className: css.h70,
        render: record => (
          record.expired
          ? <div className="warning">Expired</div>
          : !record.default &&
            <Button type="danger" className="actionButton" onClick={ () => this.destroyRecord(record) }>
              Deactivate
            </Button>
        )
      });
    }

    return columns;
  }

  getMobileTableColumns(phone) {
    const { canDelete } =this.props;
    const columns = [
      {
        title: 'Details',
        key: 'details',
        render: record => (
          <div>
            { record.default &&
              <div className="mb-10 mt-10">Default</div>
            }
            <div className={ css.detailsItem }>
              <span className={ CN(css.detailsName, 'bold-text', 'mr-5') }>Type:</span>
              <span>{ record.kind }</span>
            </div>
            <div className={ css.detailsItem }>
              <span className={ CN(css.detailsName, 'bold-text', 'mr-5') }>Holder Name:</span>
              <span>{ record.holderName }</span>
            </div>
            <div className={ css.detailsItem }>
              <span className={ CN(css.detailsName, 'bold-text', 'mr-5') }>Last 4:</span>
              <span>{ record.last4 }</span>
            </div>
            <div className={ css.detailsItem }>
              <span className={ CN(css.detailsName, 'bold-text', 'mr-5') }>Expiration Date:</span>
              <span>{ record.expirationMonth }/{ record.expirationYear }</span>
            </div>
          </div>
        )
      }
    ];

    if (this.props.canDelete) {
      columns.push({
        title: 'Action',
        key: 'action',
        render: record => (
          record.expired
          ? <div className="warning">Expired</div>
          : !record.default && (
            phone
            ? <Dropdown
                overlay={ this.dropdownMenu(record) }
                trigger={ ['click'] }
                placement="bottomRight"
              >
                <a className={ CN(css.dropdownButton, 'dots-dropdown-trigger') } href="#">...</a>
              </Dropdown>
            : <Fragment>
                <Button type="secondary" className="mr-5 actionButton" onClick={ () => this.makeDefaultRecord(record) }>
                  Make default
                </Button>
                { canDelete &&
                  <Button type="danger" className="actionButton" onClick={ () => this.destroyRecord(record) }>
                    Deactivate
                  </Button>
                }
              </Fragment>
          )
        )
      });
    }

    return columns;
  }

  render() {
    const { paymentCards, loading, canAdd, companyPaymentTypes } = this.props;

    return (
      <div>
        { canAdd &&
          <div className={ CN('layout horizontal end-justified', css.actionButtons) }>
            <Button className="mobileButton" type="primary" onClick={ () => this.showForm() }>
              <Phone>
                { match => (
                    match
                    ? '+'
                    : 'Add card'
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
          dataSource={ paymentCards }
          columns={ this.getTableColumns() }
          tabletColumns={ this.getMobileTableColumns() }
          mobileColumns={ this.getMobileTableColumns(true) }
        />

        <PaymentCardForm
          { ...bindModalState(this) }
          loading={ loading }
          width={ 720 }
          title="New Payment Card"
          onRequestSave={ this.saveForm }
          onRequestClose={ this.closeForm }
          companyPaymentTypes={ companyPaymentTypes }
        />
      </div>
    );
  }
}
