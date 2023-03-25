import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Grid, Button } from 'semantic-ui-react';
import { SideNavigation } from '@benrevo/benrevo-react-core';
import Tools from './Tools';
import Enrollment from './Enrollment';
import Disclosure from './Disclosure';
import navigation from './navigation';

class PresentationPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node.isRequired,
    client: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    section: PropTypes.string.isRequired,
    changeLoadReset: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      enrollment: false,
      tools: false,
      disclosure: false,
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  componentWillMount() {
    const { changeLoadReset } = this.props;
    changeLoadReset();
  }

  toggleModal(type) {
    this.setState({ [type]: !this.state[type] });
  }

  render() {
    const { client, section, products } = this.props;
    const {
      enrollment,
      tools,
      disclosure,
    } = this.state;
    const slotTop = () => <Button className="nowrap" color="teal" size="medium" as={Link} fluid to={`/clients/${this.props.client.id}`}>Client Home</Button>;
    return (
      <div className="presentation" key={section}>
        <Grid stackable container columns={2} className="section-wrap without-top">
          <Grid.Row>
            <Grid.Column width={16} className="top-padded-empty">
              <SideNavigation
                slotTop={slotTop}
                clientName={client.clientName}
                navigation={navigation(products)}
                modalAction={this.toggleModal}
                urlPrefix={`/clients/${this.props.client.id}/presentation`}
              />
              <div className="side-navigation-content">
                {this.props.children}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Enrollment openModal={enrollment} closeModal={this.toggleModal} />
        <Tools openModal={tools} closeModal={this.toggleModal} section={section} />
        <Disclosure openModal={disclosure} closeModal={this.toggleModal} />
      </div>
    );
  }
}

export default PresentationPage;
