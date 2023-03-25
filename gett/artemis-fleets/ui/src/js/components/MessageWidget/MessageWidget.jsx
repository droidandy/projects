import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Avatar } from 'components';
import { Modal } from 'antd';
import CN from 'classnames';
import Form, { bindState, Input } from 'components/form';
import moment from 'moment';

import css from './MessageWidget.css';

const { confirm } = Modal;

export default class MessageWidget extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    messages: PropTypes.arrayOf(PropTypes.object),
    external: PropTypes.bool,
    showForm: PropTypes.bool,
    onFormSubmit: PropTypes.func
  };

  static defaultProps = {
    height: 320
  };

  submitForm = () => {
    this.form.ifValid(() => {
      confirm({
        title: 'Send Message',
        content: 'Are you sure?',
        onOk: () => {
          return this.props.onFormSubmit(this.state.form)
            .then(() => this.setState({ form: { body: '' } }));
        }
      });
    });
  };

  formatItemBody(item) {
    if (item.title === 'Last Deploy') {
      return  <div dangerouslySetInnerHTML={ { __html: item.body } } />;
    }

    return item.body.split('\n').map((string, i) => <span key={ i }>{ string }<br /></span>);
  }

  render() {
    const { title, height, width, className, messages, showForm, external } = this.props;

    return (
     <div style={ { height, width } } className={ CN(className, 'layout vertical border-block') }>
        <div className="text-center text-uppercase text-12 light-grey-text bold-text light-grey-bg p-10">
          { title }
        </div>
        <div className="flex scroll-box wrap-break-word">
          { messages.map((item, i) => (
            <div key={ i } className="p-10 border-top">
              <div className="layout horizontal center mb-5">
                <div className="flex layout horizontal center">
                  { external
                    ? <Icon icon="IconOT" className="text-26" />
                    : <Avatar size={ 26 } src={ item.avatar } />
                  }
                  <div className="ml-10 text-12 black-text">{ external ? 'One Transport' : item.userName }</div>
                </div>
                <div className="text-10 black-text">{ moment(item.createdAt).format('DD/MM/YYYY hh:mm a') } </div>
              </div>
              <div className="ml-35">
                { this.formatItemBody(item) }
              </div>
            </div>
          )) }
        </div>
        { showForm &&
          <div className="relative">
            <Form { ...bindState(this) } ref={ form => this.form = form } validations={ { body: 'presence' } }>
              { $ => (
                <Input { ...$('body') } type="textarea" className={ css.textArea } placeholder="Type message here" autosize={ { minRows: 2, maxRows: 3 } } />
              ) }
            </Form>
            <Icon icon="MdSend" onClick={ this.submitForm } className={ `text-26 pointer blue-text ${css.icon}` } />
          </div>
        }
      </div>
    );
  }
}
