import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Form, Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router';
import { LISI, WARNER } from '../constants';

export class GAModal extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    modalToggle: PropTypes.func.isRequired,
    action: PropTypes.func.isRequired,
    brokerages: PropTypes.array.isRequired,
    route: PropTypes.string,
    brokerageFromProfile: PropTypes.string.isRequired,
  };

  constructor() {
    super();

    this.state = {
      selectedGABrokerage: '',
    };
    this.getLink = this.getLink.bind(this);
  }

  getLink() {
    const { brokerageFromProfile } = this.props;
    if (brokerageFromProfile === LISI) {
      return '/ga/account/lisi';
    }
    if (brokerageFromProfile === WARNER) {
      return '/ga/account/warner';
    }
    return '/ga/account';
  }

  render() {
    const { modalOpen, modalToggle, brokerages, action, route } = this.props;

    return (
      <Modal
        className="client-ga-modal"
        open={modalOpen}
        onClose={modalToggle}
        closeOnDimmerClick={false}
        size={'tiny'}
        closeIcon={<span className="close">X</span>}
      >
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header as="h1" className="page-heading">Choose a brokerage</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Form>
                <Form.Dropdown
                  label="Which brokerage would you like to create this client for?"
                  search
                  selection
                  placeholder="Choose"
                  options={brokerages}
                  value={this.state.selectedGABrokerage}
                  onChange={(e, inputState) => { this.setState({ selectedGABrokerage: inputState.value }); }}
                />
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column width="16">
              <Button as={Link} to={route} disabled={!this.state.selectedGABrokerage} fluid size="big" primary onClick={() => { action(this.state.selectedGABrokerage) }}>Continue</Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column width="16">
              Brokerage not listed? Request access <Link to={() => this.getLink()}>here</Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal>
    );
  }
}

export default GAModal;
