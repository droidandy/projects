import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Modal, Header, Button, Input } from 'semantic-ui-react';
import { EMAIL_REGEX } from '../constants';

class AddEmail extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    emails: PropTypes.array,
    modalToggle: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
  };

  static defaultProps = {
    emails: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      max: 4,
      current: [{ text: '', invalid: false }],
    };

    this.save = this.save.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.addEmail = this.addEmail.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.modalOpen !== this.props.modalOpen) {
      const current = (nextProps.emails && nextProps.emails.length) ? nextProps.emails.map((item) => ({ text: item, invalid: false })) : [{ text: '', invalid: false }];
      this.setState({ current });
    }
  }

  save() {
    const { save, modalToggle } = this.props;
    const { current } = this.state;
    const emails = [];
    let invalidFlag = false;
    for (let i = 0; i < current.length; i += 1) {
      const item = current[i];

      if (item && !item.text.match(EMAIL_REGEX)) {
        current[i].invalid = true;
        invalidFlag = true;
      }

      if (item) emails.push(item.text);
    }

    if (invalidFlag) {
      this.setState({ current });
      return;
    }

    if (emails.length) save(emails);
    else save([]);

    modalToggle();
  }

  changeEmail(value, index) {
    const list = this.state.current;

    list[index].text = value;
    if (value.match(EMAIL_REGEX)) {
      list[index].invalid = false;
    }

    this.setState({ current: list });
  }

  removeEmail(index) {
    const list = this.state.current;

    list.splice(index, 1);

    this.setState({ current: list });
  }

  addEmail() {
    const list = this.state.current;

    list.push({ text: '', invalid: false });

    this.setState({ current: list });
  }

  render() {
    const { modalOpen, modalToggle } = this.props;
    const { current, max } = this.state;
    return (
      <Modal
        className="add-email-modal"
        open={modalOpen}
        onClose={modalToggle}
        closeOnDimmerClick
        size="mini"
      >
        <div className="page-heading-top">
          <Header as="h1" className="page-heading small">Add Recipient Email</Header>
        </div>
        <div className="center">
          <Grid>
            {current.map((item, i) => <Grid.Row key={i}>
              <Grid.Column width={15}>
                <Input placeholder="Enter email" value={item.text} onChange={(e, inputState) => this.changeEmail(inputState.value, i)} />
                {!item.text.match(EMAIL_REGEX) && item.invalid &&
                  <p className="invalid-email-text">Invalid email address. Please use email@example.com format.</p>
                }
              </Grid.Column>
              <Grid.Column width={1} className="remove" onClick={() => this.removeEmail(i)}>
                X
              </Grid.Column>
            </Grid.Row>)}
          </Grid>
          { current.length < max && <div className="round-blue-button" onClick={this.addEmail}>
            <span>Add</span>
          </div> }
        </div>
        <div className="buttons">
          <Button size="medium" basic onClick={modalToggle}>Cancel</Button>
          <Button size="medium" primary onClick={this.save}>Save</Button>
        </div>
      </Modal>
    );
  }
}

export default AddEmail;
