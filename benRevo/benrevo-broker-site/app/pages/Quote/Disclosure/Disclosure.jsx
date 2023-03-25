import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Dropdown, Tab, Loader, Dimmer } from 'semantic-ui-react';

class DisclosureModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    disclaimerGet: PropTypes.func.isRequired,
    changeDropdown: PropTypes.func.isRequired,
    disclaimer: PropTypes.object.isRequired,
  }
  state = {
    activeIndex: '0',
  }
  componentWillMount() {
    this.props.disclaimerGet('medical');
    this.props.changeDropdown('medical');
  }

  handleRangeChange = (e) => {
    this.setState({ activeIndex: e.value });
  }

  handleTabChange = (e, { activeIndex }) => {
    this.setState({ activeIndex });
  }

  decodeHtml(plan) {
    const { disclaimer } = this.props;
    let selectedPlan;
    if (plan === 1) {
      selectedPlan = disclaimer.disclosures.ANTHEM_BLUE_CROSS.disclaimer;
    } else if (plan === 2) {
      selectedPlan = disclaimer.disclosures.ANTHEM_CLEAR_VALUE.disclaimer;
    } else if(plan === 3) {
      selectedPlan = disclaimer.disclosures.UHC.disclaimer;
    } else if(plan === 4) {
      selectedPlan = disclaimer.disclosures.CLSA_TRUST_UHC.disclaimer;
    } else if(plan === 5) {
      selectedPlan = disclaimer.disclosures.CLSA_TRUST_METLIFE.disclaimer;
    }
    if (disclaimer && selectedPlan) {
      const innerHtml = selectedPlan;
      const txt = document.createElement('textarea');
      txt.innerHTML = innerHtml;
      return { __html: txt.value };
    }
    return { __html: '<div></div>' };
  }


  render() {
    const {
      openModal,
      closeModal,
      changeDropdown,
      disclaimer,
    } = this.props;
    const products = [
      {
        key: 'medical',
        value: 'medical',
        text: <span>Medical</span>,
      },
      {
        key: 'dental',
        value: 'dental',
        text: <span>Dental</span>,
      },
      {
        key: 'vision',
        value: 'vision',
        text: <span>Vision</span>,
      },
      // {
      //   key: 'life',
      //   value: '3',
      //   text: <span>Life/AD&amp;D</span>,
      // },
      // {
      //   key: 'ltd',
      //   value: '4',
      //   text: <span>LTD</span>,
      // },
      // {
      //   key: 'volLtd',
      //   value: '5',
      //   text: <span>Vol LTD</span>,
      // },
    ];
    const panes = [];
    if (disclaimer.disclosures) {
      if (disclaimer.disclosures.ANTHEM_BLUE_CROSS && disclaimer.disclosures.ANTHEM_BLUE_CROSS.disclaimer) {
        panes.push({
          menuItem: 'Anthem Blue Cross',
          render: () => <Tab.Pane
            loading={this.props.disclaimer.loading}
            dangerouslySetInnerHTML={this.decodeHtml(1)} // eslint-disable-line
          />,
        });
      }
      if (disclaimer.disclosures.ANTHEM_CLEAR_VALUE && disclaimer.disclosures.ANTHEM_CLEAR_VALUE.disclaimer) {
        panes.push({
          menuItem: 'Anthem Clear Value',
          render: () => <Tab.Pane
            loading={this.props.disclaimer.loading}
            dangerouslySetInnerHTML={this.decodeHtml(2)} // eslint-disable-line
          />,
        });
      }
      if (disclaimer.disclosures.UHC && disclaimer.disclosures.UHC.disclaimer) {
        panes.push({
          menuItem: 'United Healthcare',
          render: () => <Tab.Pane
            loading={this.props.disclaimer.loading}
            dangerouslySetInnerHTML={this.decodeHtml(3)} // eslint-disable-line
          />,
        });
      }
      if (disclaimer.disclosures.CLSA_TRUST_UHC && disclaimer.disclosures.CLSA_TRUST_UHC.disclaimer) {
        panes.push({
          menuItem: 'CLSA Trust - United Healthcare',
          render: () => <Tab.Pane
            loading={this.props.disclaimer.loading}
            dangerouslySetInnerHTML={this.decodeHtml(4)} // eslint-disable-line
          />,
        });
      }
      if (disclaimer.disclosures.CLSA_TRUST_METLIFE && disclaimer.disclosures.CLSA_TRUST_METLIFE.disclaimer) {
        panes.push({
          menuItem: 'CLSA Trust - Metlife',
          render: () => <Tab.Pane
            loading={this.props.disclaimer.loading}
            dangerouslySetInnerHTML={this.decodeHtml(5)} // eslint-disable-line
          />,
        });
      }
    }

    return (
      <Modal
        open={openModal}
        size="large"
        className="presentation-modal presentation-modal-disclosure"
        onClose={() => { closeModal('disclosure'); }}
        closeIcon={<span className="close" />}
      >
        <Modal.Content>
          <div className="header-holding">
            <Header as="h1" className="page-heading">Disclosure</Header>
            <div className="">
              <Dropdown
                placeholder="Select Product"
                icon="angle down"
                selection
                onChange={(e, inputState) => {
                  this.props.disclaimerGet(inputState.value);
                  this.handleTabChange(e, { activeIndex: 0 });
                  changeDropdown(inputState.value);
                }}
                value={disclaimer.dropdownValue}
                options={products}
              />
            </div>
          </div>
          { disclaimer.loading ?
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer> : <Tab menu={{ secondary: true, pointing: true }} activeIndex={this.state.activeIndex} panes={panes} onTabChange={this.handleTabChange} />}
        </Modal.Content>
      </Modal>
    );
  }
}

export default DisclosureModal;
