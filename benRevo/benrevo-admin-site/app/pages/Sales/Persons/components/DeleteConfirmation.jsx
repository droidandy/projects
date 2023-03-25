import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Grid, Form, Header } from 'semantic-ui-react';

class DeleteConfirmation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    modalClose: PropTypes.func.isRequired,
    person: PropTypes.object.isRequired,
    handleDeleteClick: PropTypes.func.isRequired,
  };

  render() {
    const { modalClose, modalOpen, person, handleDeleteClick } = this.props;
    return (
      <Modal
        open={modalOpen}
        onClose={modalClose}
        className="carrier-files-remove-modal"
        dimmer="inverted"
        size="small"
      >
        <Modal.Content className="buttons-centered">
          <Grid stackable>
            <Grid.Row stretched className="header-main">
              <Grid.Column width={16}>
                <Header as="h2">Are you sure you want to delete {`${person.firstName} ${person.lastName}`}?</Header>
              </Grid.Column>
              <Grid.Column width={16}>
                <Form onSubmit={(e) => { e.preventDefault(); }}>
                  <Form.Group inline className="buttons">
                    <Button size="big" primary onClick={handleDeleteClick}>Delete</Button>
                    <Button size="big" basic onClick={() => { modalClose(); }}>Cancel</Button>
                  </Form.Group>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default DeleteConfirmation;
