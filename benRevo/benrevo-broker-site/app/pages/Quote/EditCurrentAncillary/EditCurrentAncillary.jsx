import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Tab, Button, Dimmer, Loader } from 'semantic-ui-react';
import { validateLifeStdLtdOptions } from '@benrevo/benrevo-react-rfp';
import Options from './components/Options';
import Rates from './components/Rates';
class EditCurrentModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    plansLoaded: PropTypes.bool.isRequired,
    requestError: PropTypes.bool.isRequired,
    section: PropTypes.string.isRequired,
    simpleSection: PropTypes.string.isRequired,
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    getCurrentAncillaryOption: PropTypes.func.isRequired,
    saveCurrentAncillaryOption: PropTypes.func.isRequired,
    changeLoad: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    deleteError: PropTypes.func.isRequired,
    changeShowErrors: PropTypes.func.isRequired,
    sectionState: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.saveOption = this.saveOption.bind(this);
  }

  componentWillMount() {
    const { section, getCurrentAncillaryOption, simpleSection } = this.props;

    getCurrentAncillaryOption(section, simpleSection);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.props.loading && this.props.loading && this.state.currentTab === 1 && !nextProps.requestError) {
      this.props.changeLoad(nextProps.section, { options: true });
      this.props.closeModal('editCurrent');
    } else if (nextProps.loading !== this.props.loading && this.props.loading && this.state.currentTab !== 1 && !nextProps.requestError) {
      if (this.modal && this.modal.ref.parentNode) this.modal.ref.parentNode.scrollTo(0, 0);
      this.changePage('next');
    }
  }

  changePage(direction) {
    if (direction === 'next') {
      if (this.state.currentTab < 1) this.setState({ currentTab: this.state.currentTab += 1 });
    } else {
      this.setState({ currentTab: this.state.currentTab -= 1 });
    }
  }

  handleTabChange(e, { activeIndex }) {
    this.setState({ currentTab: activeIndex });
  }

  saveOption() {
    const {
      saveCurrentAncillaryOption,
      section,
      simpleSection,
      sectionState,
      deleteError,
      setError,
      changeShowErrors,
    } = this.props;
    const ancillaryType = section.indexOf('vol_') >= 0 ? 'voluntaryPlan' : 'basicPlan';
    const valid = validateLifeStdLtdOptions({
      ...sectionState,
      setError,
      deleteError,
    }, section, ancillaryType);

    if (valid) saveCurrentAncillaryOption(section, false, ancillaryType, simpleSection);
    else if (this.state.currentTab !== 0) {
      this.setState({ currentTab: 0 }, () => {
        changeShowErrors(true);
      });
    } else changeShowErrors(true);
  }

  render() {
    const {
      openModal,
      closeModal,
      section,
      loading,
      plansLoaded,
      simpleSection,
    } = this.props;
    const { currentTab } = this.state;
    const ancillaryType = section.indexOf('vol_') >= 0 ? 'voluntaryPlan' : 'basicPlan';

    const panes = [
      { menuItem: '1. Plan Information', render: () => <Options modal={this.modal}  section={simpleSection} plansLoaded={plansLoaded} ancillaryType={ancillaryType} /> },
      { menuItem: '2. Rates', render: () => <Rates section={simpleSection} ancillaryType={ancillaryType} /> },
    ];

    return (
      <Modal
        ref={(c) => { this.modal = c; }}
        open={openModal}
        size="large"
        className="presentation-modal presentation-modal-edit-current"
        onClose={() => { closeModal('editCurrent'); }}
        closeIcon={<span className="close" />}
      >
        <Modal.Content>
          <div className="content-inner">
            <Tab onTabChange={this.handleTabChange} activeIndex={currentTab} className="presentation-tab-top-menu medicalRfpMainContainer" panes={panes} />
            <div className="pageFooterActions">
              { <Button onClick={this.saveOption} primary floated="right" size="big">Save & Continue</Button> }
              { currentTab !== 0 && <Button onClick={() => { this.changePage('back'); }} floated="left" size="big" basic>Back</Button> }
            </div>
            <Dimmer active={loading} inverted>
              <Loader indeterminate size="big">Saving...</Loader>
            </Dimmer>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default EditCurrentModal;
