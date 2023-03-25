/**
*
* RiderCard
*
*/

import React from 'react';
import { Grid } from 'semantic-ui-react';

export class LegalG2 extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <p>
            Notes:<br />
          </p>
          <p>
            - All benefits include the following pharmacy plan:  $10/$25/$35   $150l   2xMO and riders Mental Health: BDX, $15/20V Acu/Chiro  (AAM)<br />
            - If the initial quote is single option and two or more plans are sold as a multiple opion arrangement, an adjustment to the rates may be necessary.<br />
            - If the initial plan is an HRA, all alternates are also assumed to be the same type of HRA.<br />
          </p>

          <p>
            Quote Assumptions: The rates quoted are based on the following assumptions.  Changes to these assumptions may result in an adjustment to the rates or revocation of the quote.<br />
            - Rates are guaranteed for the contract period of 9/1/17 through 8/31/18.<br />
            - Rates are based on your submitted census.  UnitedHealthcare reserves the right to adjust the rates from audit date back to effective date if any of the following changes:<br />
            - Enrollment +/- 10%<br />
            - Area Factor +/- 7.5%<br />
            - Any Material Changes<br />
            - Average Contract Size +/- 10%<br />
            - Age/Sex Factor +/- 10%<br />
            - Cobra enrollees are more than 10% of enrollment<br />
            - This proposal assumes at least 46% of all benefit eligible employees (including spousal waivers) will enroll with United Healthcare.  If this assumption is not accurate, we reserve the right to requote back to original effective date.<br />
            - Unless otherwise stated, this offer replaces and renders all previous offers null and void.  New divisions must be evaluated by UnitedHealthcare prior to their addition to the plan.<br />
            - Renewals will be delivered 60 days prior to the anniversary date.  Rates and plan designs assume no changes in state or federal mandated benefits.<br />
            - If this quote is based off information provided from an RFP that did not include claims experience or renewal rates,
              final approval is contingent upon at the time the employer application is submitted.
              If the existing carrier™s combined renewal increase exceeds 20%, UnitedHealthcare reserves the right to re-rate. All large claims in excess of $25,000 or potential large claims have been disclosed. <br />
              - Signature is UnitedHealthcare™s full network HMO product<br />
              - Advantage is UnitedHealthcare™s value HMO network<br />
              - Alliance is UnitedHealthcare™s high performing HMO network<br />
              - Focus is UnitedHealthcare™s ultra-value HMO network<br />
              - Core is UnitedHealthcare{'\''}s open access product with a customized network designed to offer more affordable healthcare options. <br />
              - Quote includes UHC fulfilled Simply Engaged (not available with UHC Motion).<br />
          </p>
          <p>
            - This premium may include state and federal taxes and fees. <br />
          </p>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default LegalG2;
