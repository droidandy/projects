import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Grid, Form, Header, Message, Icon } from 'semantic-ui-react';

const warningList = [
  'Saved quote file and all networks and plans',
  'All standard options - Option 1 , Option 2, ...',
];

class QuoteDeleteModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    modalClose: PropTypes.func.isRequired,
    fileToDelete: PropTypes.string.isRequired,
    deleteQuote: PropTypes.func.isRequired,
    quoteType: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
    };

    this.updateInputText = this.updateInputText.bind(this);
  }

  updateInputText(value) {
    this.setState({ inputText: value });
  }

  render() {
    const { fileToDelete, modalClose, modalOpen, deleteQuote, quoteType } = this.props;
    const deleteDisabled = fileToDelete !== this.state.inputText;
    return (
      <Modal
        open={modalOpen}
        onClose={modalClose}
        className="quote-delete"
        dimmer="inverted"
        size="small"
      >
        <Modal.Content>
          <Grid stackable>
            <Grid.Row stretched className="header-main">
              <Grid.Column width={16}>
                <Header as="h2">Are you sure you want to delete this quote?</Header>
                <Message warning>
                  <Message.Header>
                    <Icon name="warning circle" />
                    Deleting this quote will delete:
                  </Message.Header>
                  <Message.List
                    items={warningList}
                  />
                </Message>
              </Grid.Column>
              <Grid.Column width={16}>
                <Form onSubmit={(e) => { e.preventDefault(); }} className="extra-check-form">
                  <p>If you still want to delete this quote, please type the truncated file name below (case sensitive):</p>
                  <Form.Input
                    label={fileToDelete}
                    onPaste={(e) => e.preventDefault()}
                    onChange={(e) => this.updateInputText(e.target.value)}
                  />
                  <div className="buttons-centered">
                    <a tabIndex="0" className="cancel-button" onClick={() => { modalClose(); }}>Cancel</a>
                    <Button disabled={deleteDisabled} className="not-link-button" size="medium" primary onClick={() => { deleteQuote(quoteType); modalClose(); }}>Delete</Button>
                  </div>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default QuoteDeleteModal;
