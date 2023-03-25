import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Tab, Button, Dimmer, Loader } from 'semantic-ui-react';
import { validateOptions } from '@benrevo/benrevo-react-rfp';
import Options from './components/Options';
import Rates from './components/Rates';
import Contribution from './components/Contribution';
import Enrollment from './components/Enrollment';
import Benefits from './components/Benefits';

class EditCurrentAncillaryModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    plansLoaded: PropTypes.bool.isRequired,
    requestError: PropTypes.bool.isRequired,
    section: PropTypes.string.isRequired,
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    getCurrentOption: PropTypes.func.isRequired,
    saveCurrentOption: PropTypes.func.isRequired,
    changeLoad: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    deleteError: PropTypes.func.isRequired,
    changeShowErrors: PropTypes.func.isRequired,
    sectionState: PropTypes.object.isRequired,
    otherCarrier: PropTypes.object.isRequired,
    virginCoverage: PropTypes.object.isRequired,
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
    const { section, getCurrentOption } = this.props;

    getCurrentOption(section);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.props.loading && this.props.loading && (this.state.currentTab === 4 || (nextProps.virginCoverage[nextProps.section] && this.state.currentTab === 2)) && !nextProps.requestError) {
      this.props.changeLoad(nextProps.section, { options: true });
      this.props.closeModal('editCurrent');
    } else if (nextProps.loading !== this.props.loading && this.props.loading && this.state.currentTab !== 4 && !nextProps.requestError) {
      this.changePage('next');
    }
  }

  changePage(direction) {
    if (direction === 'next') {
      if (this.state.currentTab < 4) this.setState({ currentTab: this.state.currentTab += 1 });
    } else {
      this.setState({ currentTab: this.state.currentTab -= 1 });
    }
  }

  handleTabChange(e, { activeIndex }) {
    this.setState({ currentTab: activeIndex });
  }

  saveOption() {
    const {
      saveCurrentOption,
      section,
      virginCoverage,
      sectionState,
      deleteError,
      setError,
      changeShowErrors,
    } = this.props;
    const valid = validateOptions({
      ...sectionState,
      virginCoverage,
      setError,
      deleteError,
    }, section);

    if (valid) saveCurrentOption(section);
    else if (this.state.currentTab !== 0) {
      this.setState({ currentTab: 0 }, () => {
        changeShowErrors(true);
      });
    } else changeShowErrors(true);

    return valid;
  }

  render() {
    const {
      openModal,
      section,
      loading,
      plansLoaded,
      otherCarrier,
      virginCoverage,
      closeModal,
    } = this.props;
    const { currentTab } = this.state;
    let panes = [];

    if (!virginCoverage[section]) {
      panes = [
        { menuItem: '1. Plan Information', render: () => <Options modal={this.modal} section={section} plansLoaded={plansLoaded} otherCarrier={otherCarrier} /> },
        { menuItem: '2. Rates', render: () => <Rates section={section} /> },
        { menuItem: '3. Contribution', render: () => <Contribution section={section} /> },
        { menuItem: '4. Enrollment', render: () => <Enrollment section={section} /> },
        { menuItem: '5. Benefits', render: () => <Benefits section={section} /> },
      ];
    } else {
      panes = [
        { menuItem: '1. Plan Information', render: () => <Options modal={this.modal} section={section} plansLoaded={plansLoaded} otherCarrier={otherCarrier} /> },
        { menuItem: '2. Contribution', render: () => <Contribution section={section} /> },
        { menuItem: '3. Benefits', render: () => <Benefits section={section} /> },
      ];
    }

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

export default EditCurrentAncillaryModal;
