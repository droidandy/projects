import React from 'react';
import PropTypes from 'prop-types';
import { SubscriptionCard } from '@benrevo/benrevo-react-quote';
import CarrierLogo from '../../../../components/CarrierLogo';

class ContributionTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    section: PropTypes.string.isRequired,
    contributions: PropTypes.array.isRequired,
    newPlan: PropTypes.object,
    changeContributionType: PropTypes.func.isRequired,
    changeContribution: PropTypes.func.isRequired,
    saveContributions: PropTypes.func.isRequired,
    cancelContribution: PropTypes.func.isRequired,
    editContribution: PropTypes.func.isRequired,
    contributionsEdit: PropTypes.object.isRequired,
    openedOption: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.saveContributions = this.saveContributions.bind(this);
  }

  saveContributions(index) {
    this.props.saveContributions(this.props.section, this.props.openedOption.id, index);
  }

  render() {
    return (
      <div className="presentation-overview">
        { this.props.contributions.length > 0 && this.props.contributions.map((item, index) =>
          <SubscriptionCard
            key={index}
            index={index}
            readOnly={false}
            section={this.props.section}
            loading={this.props.loading}
            newPlan={this.props.newPlan}
            contributionsEdit={this.props.contributionsEdit[index]}
            changeContributionType={this.props.changeContributionType}
            changeContribution={this.props.changeContribution}
            saveContributions={this.saveContributions}
            cancelContribution={this.props.cancelContribution}
            editContribution={this.props.editContribution}
            contributions={item}
            CarrierLogo={CarrierLogo}
          />
        )}
      </div>
    );
  }
}

export default ContributionTable;
