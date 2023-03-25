import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Header } from 'semantic-ui-react';
import { LifeStdLtdOptions } from '@benrevo/benrevo-react-rfp';
import { scrollToInvalid } from '@benrevo/benrevo-react-core';

class CurrentAncillaryOptions extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    containerId: PropTypes.string.isRequired,
    ancillaryType: PropTypes.string.isRequired,
    carrierList: PropTypes.array.isRequired,
    formErrors: PropTypes.object.isRequired,
    modal: PropTypes.object.isRequired,
    showErrors: PropTypes.bool.isRequired,
    changeShowErrors: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    const {
      formErrors,
      changeShowErrors,
      showErrors,
      modal,
      containerId,
    } = nextProps;

    if (formErrors && Object.keys(formErrors)[0] && showErrors && showErrors !== this.props.showErrors) {
      if (modal.ref && modal.ref.parentNode) modal.ref.parentNode.id = containerId;
      scrollToInvalid(Object.keys(formErrors), null, null, containerId);
      changeShowErrors(false);
    }
  }

  render() {
    const { ancillaryType } = this.props;
    return (
      <Tab.Pane>
        <Header as="h1" className="page-heading">Plan Information</Header>
        <LifeStdLtdOptions
          {...this.props}
          hideButtons
          hideTitle
          showBasic={ancillaryType === 'basicPlan'}
          showVoluntary={ancillaryType === 'voluntaryPlan'}
          hideVoluntary={ancillaryType === 'basicPlan'}
          hideBasic={ancillaryType === 'voluntaryPlan'}
        />
      </Tab.Pane>
    );
  }
}

export default CurrentAncillaryOptions;
