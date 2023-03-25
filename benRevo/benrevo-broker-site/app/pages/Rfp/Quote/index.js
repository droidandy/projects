import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import { Quote } from '@benrevo/benrevo-react-rfp';

class QuotePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    routes: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
  };

  render() {
    const { clientId } = this.props.params;
    const section = this.props.routes[4].path;
    const routes = [...this.props.routes];
    const diagnosisHeader = () => <Header as="h3" className="rfpPageFormSetHeading">Are you aware of any large claims in excess of $50k within the past 12 months? If so, please include diagnosis, status and claim amount. Carriers may reserve the right to revise their quotes after underwriter review of large claims.</Header>;
    const FileNote = () => <div style={(section !== 'medical' && section !== 'life' && section !== 'std' && section !== 'ltd') ? { marginTop: -30 } : null} />;
    const claimsHeader = () => <Header as="h3" className="rfpPageFormSetHeading">Are you aware of any large claims in excess of $50k within the past 12 months? If so, please include diagnosis, status and claim amount.&nbsp;</Header>;
    let benefitsHeader = null;

    if (section === 'medical') benefitsHeader = () => <Header as="h3" className="rfpPageFormSetHeading">Upload the census, {section} health questionnaire and {section} benefit summaries</Header>;
    else benefitsHeader = () => <Header as="h3" className="rfpPageFormSetHeading">Please upload the {section} census and {section} benefit summaries</Header>;

    routes.splice(1, 2);
    console.log(routes);
    return (
      <Quote
        {...this.props}
        showAlongSidePopup={false}
        diagnosisHeader={diagnosisHeader}
        claimsHeader={claimsHeader}
        benefitsHeader={benefitsHeader}
        fileNote={FileNote}
        routes={routes}
        section={section}
        prefix={`/clients/${clientId}`}
      />
    );
  }
}

export default QuotePage;
