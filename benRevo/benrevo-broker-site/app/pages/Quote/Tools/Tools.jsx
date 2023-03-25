import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Tab } from 'semantic-ui-react';
import Networks from './components/Networks';
import Providers from './components/Providers';

class ToolsModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    openModal: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    providersRows: PropTypes.object.isRequired,
    providersCols: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    getComparison: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { getComparison } = this.props;
    getComparison();
  }

  render() {
    const {
      openModal,
      closeModal,
      section,
      loading,
      providersRows,
      providersCols,
    } = this.props;
    const panes = [
      { menuItem: 'Anthem Networks', render: () => <Networks carrierName="Anthem Blue Cross" section={section} /> },
      {
        menuItem: 'Anthem Providers',
        render: () => <Providers
          loading={loading}
          rows={providersRows.anthem}
          cols={providersCols.anthem}
        />,
      },
      { menuItem: 'UHC Networks', render: () => <Networks carrierName="UnitedHealthcare" section={section} /> },
      {
        menuItem: 'UHC Providers',
        render: () => <Providers
          loading={loading}
          rows={providersRows.uhc}
          cols={providersCols.uhc}
        />,
      },
    ];

    return (
      <Modal
        open={openModal}
        size="large"
        className="presentation-modal presentation-modal-tools"
        onClose={() => { closeModal('tools'); }}
        closeIcon={<span className="close" />}
      >
        <Modal.Content>
          <Header as="h1" className="page-heading">Network Tools</Header>
          <div className="content-inner">
            <Tab className="tab-menu" panes={panes} />
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default ToolsModal;
