import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { FormBase } from '@benrevo/benrevo-react-rfp';
import { Button, Card, Loader } from 'semantic-ui-react';
import { MEDICAL_SECTION, KAISER_SECTION } from '../constants';

class Section extends FormBase { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    clientSaveInProgress: PropTypes.bool.isRequired,
    section: PropTypes.string.isRequired,
    clientId: PropTypes.string,
    routes: PropTypes.array.isRequired,
    products: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    formErrors: PropTypes.object.isRequired,
    virginCoverage: PropTypes.object.isRequired,
    redirect: PropTypes.func.isRequired,
    sendRfp: PropTypes.func.isRequired,
    saveClient: PropTypes.func.isRequired,
    changeShowErrors: PropTypes.func.isRequired,
    showErrors: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    browserHistory.listen(() => {
      this.checkRoute();
    });
  }

  componentWillMount() {
    this.checkRoute();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.clientSaveInProgress && this.props.clientSaveInProgress && nextProps.client.id && this.props.section === 'client') {
      this.changePage('next');
    }
  }

  checkRoute() {
    const { products, redirect, routes, section, clientId } = this.props;

    if (section === 'match' || section === 'rate') {
      const page = routes[3].path;
      if (products[page] === false || (page === KAISER_SECTION && products[MEDICAL_SECTION] === false)) {
        redirect(clientId);
      }
    } else if (section !== 'client') {
      if (products[section] === false) {
        redirect(clientId);
      }
    }
  }

  savePage() {
    const { section, saveClient, clientSaveInProgress, routes, clientId, sendRfp } = this.props;
    const page = routes[3].path;
    if (section !== 'client') this.saveInformationSection('next');
    if (section === 'client' || page === 'uw') {
      if (!clientSaveInProgress) {
        saveClient();

        if (clientId) sendRfp();
      }
    }
  }

  render() {
    const {
      section,
      clientSaveInProgress,
      routes,
    } = this.props;
    const page = routes[3].path;

    return (
      <div className="prequote-section" key={section + page}>
        { section !== 'match' &&
          <Card fluid>
            <Card.Content>
              {this.props.children}

              { section !== 'rate' &&
                <div className="bottom-actions">
                  <Button disabled={clientSaveInProgress} onClick={() => { this.savePage(); }} primary floated={'right'} size="big">Save & Continue</Button>
                  <Loader inline active={clientSaveInProgress} size="small" />
                </div>
              }
            </Card.Content>
          </Card>
        }
        { section === 'match' && this.props.children }
      </div>
    );
  }
}

export default Section;
