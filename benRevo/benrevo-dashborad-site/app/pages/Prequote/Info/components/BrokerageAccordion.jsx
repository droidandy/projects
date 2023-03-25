import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { STATES } from '@benrevo/benrevo-react-rfp';
import {
  Header,
  Form,
  Input,
  Dropdown,
  Accordion,
  Menu,
  Button,
} from 'semantic-ui-react';
import NumberFormat from 'react-number-format';

class BrokerageAccordion extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    changeNewBroker: PropTypes.func.isRequired,
    setReadyToSave: PropTypes.func.isRequired,
    newBroker: PropTypes.object.isRequired,
  };
  state = {
    activeIndex: null,
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  }

  onInputChangeHandler = (e, data) => {
    const { changeNewBroker } = this.props;
    changeNewBroker(data.name, e.target.value);
    this.setState({
      [data.name]: e.target.value,
    });
  }

  onDropdownChangeHandler = (e, data) => {
    const { changeNewBroker } = this.props;
    changeNewBroker(data.name, data.value);
    this.setState({
      [data.name]: data.value,
    });
  }

  onNumberChangeHandler = (e) => {
    const { changeNewBroker } = this.props;
    changeNewBroker('zip', e.target.value);
    this.setState({
      zip: e.target.value,
    });
  }

  expandField = (e, titleProps) => {
    const { setReadyToSave, newBroker: { readyToSave } } = this.props;
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? null : index;

    setReadyToSave(!readyToSave);
    this.setState({ activeIndex: newIndex });
  }

  clearValueHandler = () => {
    const { changeNewBroker } = this.props;
    changeNewBroker('name', '');
    this.setState({
      name: '',
    });
  }

  render() {
    const { activeIndex } = this.state;
    const { newBroker } = this.props;

    return (
      <Accordion as={Menu} vertical>
        <Menu.Item>
          <Accordion.Title
            active={activeIndex === 0}
            content="ENTER YOUR BROKERAGE INFO"
            index={0}
            onClick={this.expandField}
          />
          <Accordion.Content
            className="brokerage-accordion"
            active={activeIndex === 0}
            content={
              <Fragment>
                <Header as="h4" className="title-form">Name of Brokerage</Header>
                <div className="contacts-holder">
                  <Form.Field width={16}>
                    <Input
                      placeholder="Enter Brokerage"
                      name="name"
                      onChange={this.onInputChangeHandler}
                      value={newBroker.values.name ? newBroker.values.name : ''}
                    />
                    <Button className="del-button" index={0} onClick={this.expandField}>X</Button>
                  </Form.Field>
                </div>
                <Header as="h4" className="title-form">Address</Header>
                <Form.Field>
                  <Input
                    placeholder="Enter address"
                    name="address"
                    onChange={this.onInputChangeHandler}
                    value={newBroker.values.address ? newBroker.values.address : ''}
                  />
                </Form.Field>
                <Form.Field>
                  <Input
                    placeholder="Enter city"
                    name="city"
                    onChange={this.onInputChangeHandler}
                    value={newBroker.values.city ? newBroker.values.city : ''}
                  />
                </Form.Field>
                <div className="input-holder">
                  <Dropdown
                    className="dropdown-small"
                    placeholder="Select your state" search selection
                    name="state"
                    options={STATES}
                    value={newBroker.values.state ? newBroker.values.state : ''}
                    onChange={this.onDropdownChangeHandler}
                  />
                  <NumberFormat
                    className="input-small"
                    customInput={Input}
                    allowNegative={false}
                    placeholder="Zip Code"
                    name="zip"
                    value={newBroker.values.zip ? newBroker.values.zip : ''}
                    format="#####"
                    onChange={this.onNumberChangeHandler}
                  />
                </div>
              </Fragment>
            }
          />
        </Menu.Item>
      </Accordion>
    );
  }
}

export default BrokerageAccordion;
