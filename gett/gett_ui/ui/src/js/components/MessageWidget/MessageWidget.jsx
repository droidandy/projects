import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Avatar, Desktop, Swipeable, confirm } from 'components';
import { Spin } from 'antd';
import CN from 'classnames';
import Form, { bindState, TextArea } from 'components/form';
import moment from 'moment';
import update from 'update-js/fp';
import { map, isEmpty, difference } from 'lodash';

import css from './MessageWidget.css';

const PER_PAGE = 10;
const MSG_MAX_LENGTH = 2000;

export default class MessageWidget extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    messages: PropTypes.arrayOf(PropTypes.object),
    external: PropTypes.bool,
    showForm: PropTypes.bool,
    onFormSubmit: PropTypes.func,
    name: PropTypes.string
  };

  static defaultProps = {
    height: 320
  };

  state = {
    index: 0,
    messages: [],
    page: 0,
    loading: false
  };

  setFormRef = form => this.form = form;

  componentDidUpdate(prevProps, prevState) {
    const { page } = prevState;
    const { messages } = this.props;
    const newMessages = difference(messages, prevProps.messages);

    if ((isEmpty(this.state.messages) || this.state.page !== page) && !isEmpty(messages)) {
      this.loadMessages();
    } else if (!isEmpty(newMessages)) {
      this.addMessage(newMessages);
    }
  }

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

  nextMessage = () => {
    const { index } = this.state;
    const { messages } = this.props;
    let { page } = this.state;

    if (index < messages.length - 1) {
      let loading = false;
      if (index >= page * PER_PAGE) {
        page = page + 1;
        loading = true;
      }
      this.setState({ index: index + 1, page, loading });
    }
  };

  previousMessage = () => {
    const { index } = this.state;

    if (index > 0) {
      this.setState({ index: index - 1 });
    }
  };

  handleScroll = (e) => {
    const { target: { scrollTop, clientHeight, scrollHeight } } = e;
    const { messages, page } = this.state;
    const newMessages = this.props.messages;

    if (scrollHeight - scrollTop <= clientHeight && messages.length < newMessages.length) {
      this.setState({
        page: page + 1,
        loading: true
      });
    }
  };

  loadMessages() {
    const { messages: propsMessages } = this.props;
    const { messages: stateMessages, page } = this.state;
    const messages = [...stateMessages];

    messages.push(...propsMessages.slice(page * PER_PAGE, (page + 1) * PER_PAGE));

    this.setState({
      messages,
      loading: false
    });
  }

  addMessage(newMessages) {
    this.setState(update.unshift('messages', ...newMessages));
  }

  formatItemBody(item) {
    if (item.title === 'Last Deploy') {
      return  <div dangerouslySetInnerHTML={ { __html: item.body } } />;
    }

    return map(item.body.split('\n'), (string, i) => (
      <span className={ CN(css.messageText, 'text-14') } key={ i }>{ string }<br /></span>
    ));
  }

  renderMessages = (isDesktop) => {
    const { external } = this.props;
    const { messages } = this.state;

    return map(messages, (item, i) => (
      <div key={ i } className={ CN('p-10 border-top', { 'scroll-box auto shrink-0 full-width': !isDesktop }) }>
        <div className="layout horizontal center mb-5">
          <div className="flex layout horizontal center">
            { external
              ? <Icon icon="IconGett" className="text-26" />
              : <Avatar size={ 26 } src={ item.avatar } />
            }
            <div className="flex layout vertical ml-15">
              <div className="text-12 black-text bold-text">{ external ? 'Gett Business Solutions' : item.title || 'Test user' }</div>
              <div className="text-10 medium-grey-text bold-text">{ moment(item.createdAt).format('DD/MM/YYYY hh:mm a') } </div>
            </div>
          </div>
        </div>
        <div className={ CN({ 'mr-25': !isDesktop }) }>
          { this.formatItemBody(item) }
        </div>
      </div>
    ));
  };

  render() {
    const { height, width, className, showForm, name } = this.props;
    const { index, messages, loading } = this.state;

    return (
      <Desktop>
        { matches => (
          <div className={ className } data-name={ name }>
            <div style={ { height: height, width: matches ? width : '100%' } } className={ CN('layout vertical relative white-bg', { [css.wrapper]: !matches }) }>
              <Spin spinning={ loading } />
              { messages.length === 0
                ? <div className="flex layout horizontal center-center">no messages yet</div>
                : matches
                  ? <div onScroll={ this.handleScroll } className="flex wrap-break-word scroll-box">{ this.renderMessages(matches) }</div>
                  : <Swipeable
                      onSwipedLeft={ this.nextMessage }
                      onSwipedRight={ this.previousMessage }
                      style={ { marginLeft: `${index * -100}%` } }
                      className={ CN(css.messages, 'flex wrap-break-word layout horizontal full-width') }
                    >
                      { this.renderMessages(matches) }
                    </Swipeable>
              }
              { showForm &&
                <div className={ `relative ${css.form}` }>
                  <Form { ...bindState(this) } ref={ this.setFormRef } validations={ { body: 'presence' } }>
                    { $ => (
                      <TextArea
                        { ...$('body') }
                        className={ css.textArea }
                        placeholder="Start typing"
                        autosize={ { minRows: 2, maxRows: 3 } }
                        maxLength={ MSG_MAX_LENGTH }
                        data-name="body"
                      />
                    ) }
                  </Form>
                  <Icon icon="MdSend" onClick={ this.submitForm } className={ `text-26 pointer yellow-text ${css.icon}` } />
                </div>
              }
              { !matches && messages.length > 0 &&
                <div className={ CN(css.arrows, 'layout horizontal justified full-width') }>
                  <Icon icon="MdChevronLeft" className="text-40" onClick={ this.previousMessage } disabled={ index < 1 } />
                  <Icon icon="MdChevronRight" className="text-40" onClick={ this.nextMessage } disabled={ index === messages.length - 1 || messages.length === 0 } />
                </div>
              }
            </div>
          </div>
        )}
      </Desktop>
    );
  }
}
