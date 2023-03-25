/*
 *
 * MedicalOverview
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Modal, Image } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import { TextLoader, LearnMoreBenefit } from '@benrevo/benrevo-react-core';
import BenefitModal from './components/BanefitModal';
import { PLAN_TYPE_MEDICAL } from '../../constants';

import PresentationListHeader from './PresentationListHeader';
import {
  PremiumStatLarge,
  LearnMoreBenefitImage,
  OverviewPlans,
  PlanLabel,
} from './componentStyles';
import { Label, DividedRow, PremiumStatSmall } from '../presentationComponents';

export class MedicalOverview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({
      modalOpen: true,
    });
  }

  closeModal() {
    this.setState({
      modalOpen: false,
    });
  }

  render() {
    const { carrier, quoteType } = this.props;
    const getValue = (value) => {
      if (value) {
        return (
          <FormattedNumber
            style="currency" // eslint-disable-line react/style-prop-object
            currency="USD"
            minimumFractionDigits={0}
            maximumFractionDigits={0}
            value={value}
          />
        );
      }

      return <span> - </span>;
    };
    return (
      <Grid centered className="topOverview" style={{ marginBottom: '40px' }}>
        <Grid.Column width={11}>
          <OverviewPlans>
            <PresentationListHeader />
            <Grid container>
              { this.props.overviewPlans.map((plan, index) =>
                <DividedRow verticalAlign="middle" key={index} >
                  <Grid.Column width={7}>{plan.carrier || '-'} {(quoteType === 'KAISER' || plan.quoteType === 'KAISER') && ' + Kaiser'} <PlanLabel>{plan.label}</PlanLabel></Grid.Column>
                  <Grid.Column width={3}>
                    {getValue(plan.employer)}
                  </Grid.Column>
                  <Grid.Column width={3}>
                    {getValue(plan.employee)}
                  </Grid.Column>
                  <Grid.Column width={3}>
                    {getValue(plan.total)}
                  </Grid.Column>
                </DividedRow>
              )}
            </Grid>
          </OverviewPlans>
        </Grid.Column>
        <Grid.Column width={5}>
          <Grid style={{ marginTop: '-50px' }}>
            <Grid.Column width={16}>
              <PremiumStatLarge>
                <TextLoader loading={this.props.loading}>
                  <FormattedNumber
                    style="currency" // eslint-disable-line react/style-prop-object
                    currency="USD"
                    minimumFractionDigits={0}
                    maximumFractionDigits={0}
                    value={this.props.totalAnnualPremium || 0}
                  />
                </TextLoader>
                <Label>{carrier.carrier.displayName} total annual premium</Label>
              </PremiumStatLarge>
            </Grid.Column>
            <Grid.Column computer={6} tablet={16}>
              <PremiumStatSmall align="right">
                <TextLoader loading={this.props.loading}>
                  <div>
                    {this.props.percentDifference || 0}
                    <span>%</span>
                  </div>
                </TextLoader>
                <Label>Difference</Label>
              </PremiumStatSmall>
            </Grid.Column>
            <Grid.Column computer={10} tablet={16}>
              <PremiumStatSmall align="right">
                <TextLoader loading={this.props.loading}>
                  <FormattedNumber
                    style="currency" // eslint-disable-line react/style-prop-object
                    currency="USD"
                    minimumFractionDigits={0}
                    maximumFractionDigits={0}
                    value={this.props.dollarDifference || 0}
                  />
                </TextLoader>
                <Label>Difference</Label>
              </PremiumStatSmall>
            </Grid.Column>
            {!this.props.multiMode && this.props.section === PLAN_TYPE_MEDICAL && (quoteType === 'EASY' || quoteType === 'KAISER_EASY') &&
            <Grid.Column width={16}>
              <LearnMoreBenefitImage onClick={this.openModal}>
                <Image src={LearnMoreBenefit} />
              </LearnMoreBenefitImage>
            </Grid.Column>
            }
          </Grid>
        </Grid.Column>
        { this.state.modalOpen &&
        <Grid.Column width={16} ref={(modalMount) => { this.modalMount = modalMount; }}>
          <Modal
            className="benefit-modal"
            open={this.state.modalOpen}
            onClose={this.closeModal}
            size="small"
            closeIcon="close"
          >
            <Modal.Header className="modal-header">
              <h4 className="modal-title"><span>{this.props.carrierName}</span> provides you <p>ﬁnancial stability for the long term.</p></h4>
            </Modal.Header>
            <Modal.Content>
              <BenefitModal carrierName={this.props.carrierName} yearlyCPCost={this.props.currentPlanAnnual || 0} yearlyAPCost={this.props.newPlanAnnual || 0} carrierAP={(this.props.overviewPlans) ? this.props.overviewPlans[1].carrier : ''} />
            </Modal.Content>
          </Modal>
        </Grid.Column>
        }
      </Grid>
    );
  }
}

MedicalOverview.propTypes = {
  section: PropTypes.string,
  quoteType: PropTypes.string,
  carrierName: PropTypes.string,
  loading: PropTypes.bool,
  multiMode: PropTypes.bool,
  totalAnnualPremium: PropTypes.number,
  newPlanAnnual: PropTypes.number,
  currentPlanAnnual: PropTypes.number,
  percentDifference: PropTypes.number,
  dollarDifference: PropTypes.number,
  overviewPlans: PropTypes.array,
  carrier: PropTypes.object,
};

export default MedicalOverview;
