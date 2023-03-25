import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  Form,
  Input,
  Button,
  Accordion,
  Menu,
} from 'semantic-ui-react';

class BrokerAccordion extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    addBrokerContactsField: PropTypes.func.isRequired,
    removeBrokerContactsField: PropTypes.func.isRequired,
    updateBrokerContactsFields: PropTypes.func.isRequired,
    contactType: PropTypes.string.isRequired,
    brokerId: PropTypes.number,
  };
  state = {
    activeIndex: null,
    fields: [
    ],
  }

  onInputChangeHandler = (e, data, index) => {
    const { updateBrokerContactsFields, contactType, brokerId } = this.props;
    updateBrokerContactsFields(e.target.value, brokerId, index, contactType);
  }

  removeField = (index) => {
    const { removeBrokerContactsField, contactType } = this.props;
    const { fields } = this.state;
    this.setState({
      fields: fields.filter((el, i) => i !== index - 1),
    });
    removeBrokerContactsField(index, contactType);
  }

  addNewField = () => {
    const { addBrokerContactsField, contactType, brokerId } = this.props;
    const { fields } = this.state;
    this.setState({
      fields: [...fields, { email: null }],
    });
    addBrokerContactsField(contactType, fields.length + 1, { email: null, brokerageId: brokerId });
  }

  expandField = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? null : index;

    this.setState({
      activeIndex: newIndex,
    });
  }

  render() {
    const { activeIndex, fields } = this.state;
    const { contactType } = this.props;
    const title = contactType === 'newBrokerContacts' ? 'ENTER YOUR BROKER INFO' : 'ENTER THE GA INFO';

    return (
      <Accordion as={Menu} vertical>
        <Menu.Item>
          <Accordion.Title
            active={activeIndex === 1}
            content={title}
            index={1}
            onClick={this.expandField}
          />
          <Accordion.Content
            active={activeIndex === 1}
            className="broker-accordion"
            content={
              <Fragment>
                <Header as="h4" className="title-form">Broker Email</Header>
                <div className="contacts-holder">
                  <Form.Field>
                    <Input
                      placeholder="Email"
                      name="email"
                      value={this.props[contactType][0] && this.props[contactType][0].email ? this.props[contactType][0].email : ''}
                      onChange={(e, data) => this.onInputChangeHandler(e, data, 0)}
                    />
                  </Form.Field>
                </div>
                {
                  fields && fields.map((el, i) => (
                    <div key={i + 1} className="contacts-holder">
                      <Form.Field>
                        <Input
                          placeholder="Email"
                          name="email"
                          value={this.props[contactType][i + 1] && this.props[contactType][i + 1].email ? this.props[contactType][i + 1].email : ''}
                          onChange={(e, data) => this.onInputChangeHandler(e, data, i + 1)}
                        />
                        <Button className="del-button" onClick={() => this.removeField(i + 1)}>X</Button>
                      </Form.Field>
                    </div>
                  ))
                }
                <Button onClick={() => this.addNewField()} className="add-field dropdown-add-field">ADD ANOTHER</Button>
              </Fragment>
            }
          />
        </Menu.Item>
      </Accordion>
    );
  }
}

export default BrokerAccordion;
