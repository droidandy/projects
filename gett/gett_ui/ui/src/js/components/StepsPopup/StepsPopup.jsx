import React, { Children, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { Button, Icon, notification } from 'components';

import css from './style.css';

export default class StepsPopup extends PureComponent {
  static propTypes = {
    children: PropTypes.node
  };

  state = {
    step: 0,
    visible: true
  };

  next = this.goto.bind(this, 1);
  prev = this.goto.bind(this, -1);

  goto(change) {
    this.setState({ step: this.state.step + change });
  }

  onFinish = () => {
    this.setState({ visible: false });
    notification.success('Processing complete!');
  };

  render() {
    const { children } = this.props;
    const { step, visible } = this.state;
    const totalSteps = Children.count(children);

    return (
      <Modal
        title={ <Icon icon="LogoOT" width={ 130 } height={ 50 } /> }
        width={ 1200 }
        className={ css.modal }
        visible={ visible }
        closable={ false }
        footer={
          <div className="flex layout horizontal end-justified">
            { step > 0 &&
              <Button type="secondary" onClick={ this.prev }>Previous</Button>
            }
            { step < totalSteps - 1 &&
              <Button type="secondary" onClick={ this.next }>Next</Button>
            }
            { step === totalSteps - 1 &&
              <Button type="primary" onClick={ this.onFinish }>Finish</Button>
            }
          </div>
        }
      >
        { Children.toArray(children)[step] }
      </Modal>
    );
  }
}
