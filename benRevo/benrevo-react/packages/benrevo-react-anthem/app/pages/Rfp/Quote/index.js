import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import {
  Quote,
} from '@benrevo/benrevo-react-rfp';
import { carrierName } from '../../../config';

class QuotePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    routes: PropTypes.array.isRequired,
  };

  render() {
    const section = this.props.routes[2].path;
    let benefitsHeader = null;
    const diagnosisHeader = () => <Header as="h3" className="rfpPageFormSetHeading">Are you aware of any large claims in excess of $50k within the past 12 months? If so, please include diagnosis, status and claim amount.&nbsp;Clear Value instant quote is subject to UW review if there are ongoing large claims. Anthem Blue Cross reserves the right to revise the quote after underwriter review.</Header>;
    const FileNote = () => <div className="field-note">
      <b>Important:</b> Do not upload census here. We will remind you to email the census directly to { carrierName } at the end of the RFP section.
    </div>;
    const claimsHeader = () => <Header as="h3" className="rfpPageFormSetHeading">Are you aware of any large claims in excess of $50k within the past 12 months? If so, please include diagnosis, status and claim amount.&nbsp;Clear Value instant quote is subject to UW review if there are ongoing large claims. Anthem Blue Cross reserves the right to revise the quote after underwriter review.</Header>;
    if (section === 'medical') benefitsHeader = () => <Header as="h3" className="rfpPageFormSetHeading">Please upload the benefits summaries</Header>;
    else benefitsHeader = () => <Header as="h3" className="rfpPageFormSetHeading">Please upload your current benefit summary for this plan</Header>;

    return (
      <Quote
        {...this.props}
        showAlongSidePopup
        diagnosisHeader={diagnosisHeader}
        claimsHeader={claimsHeader}
        benefitsHeader={benefitsHeader}
        fileNote={FileNote}
      />
    );
  }
}

export default QuotePage;
