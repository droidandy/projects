import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Accordion, Image } from 'semantic-ui-react';
import {
  ArrowUp,
} from '@benrevo/benrevo-react-core';
import LifeADDBenefits from './BenefitsComponents/LifeADDBenefits';
import LifeADDCost from './CostComponents/LifeAddCost';
import StdCost from './CostComponents/StdCost';
import StdBenefits from './BenefitsComponents/StdBenefits';
import LtdCost from './CostComponents/LtdCost';
import LtdBenefits from './BenefitsComponents/LtdBenefits';

class FirstColumn extends React.Component {
  static propTypes = {
    accordionActiveIndex: PropTypes.array.isRequired,
    accordionClick: PropTypes.func.isRequired,
    editBenefitInfo: PropTypes.func,
    section: PropTypes.string.isRequired,
  };

  static defaultProps = {
    editBenefitInfo: null,
  };

  render() {
    const {
      accordionActiveIndex,
      accordionClick,
      editBenefitInfo,
      section,
    } = this.props;
    return (
      <div className={`alternatives-titles life ${section}`}>
        <div className="table-header-row">
          <div className="alt-table-column first first-column">
            <Grid columns={1}>
              <Grid.Row className={editBenefitInfo ? 'edit-benefits logo-row' : 'logo-row'} />
            </Grid>
            <Grid columns={1}>
              <Grid.Row className="plan-name-row">
                PLAN NAME
              </Grid.Row>
            </Grid>
          </div>
        </div>
        <Accordion>
          <Accordion.Title active={accordionActiveIndex[0]} onClick={() => accordionClick(0)}>
            <Grid className="alt-table-column first first-column">
              <Grid.Row className="cost-row">
                COST
                <Image className={`icon-image ${accordionActiveIndex[0] ? 'up' : 'down'}`} src={ArrowUp} />
              </Grid.Row>
            </Grid>
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[0]}>
            { (section === 'life' || section === 'vol_life') &&
            <LifeADDCost section={section} />
            }
            { (section === 'std' || section === 'vol_std') &&
            <StdCost section={section} />
            }
            { (section === 'ltd' || section === 'vol_ltd') &&
            <LtdCost section={section} />
            }
          </Accordion.Content>
        </Accordion>
        <Accordion className="bottom">
          <Accordion.Title active={accordionActiveIndex[1]} onClick={() => accordionClick(1)}>
            <Grid className="alt-table-column first first-column">
              <Grid.Row className="benefits-row">
                BENEFITS
                <Image src={ArrowUp} className={`icon-image ${accordionActiveIndex[1] ? 'up' : 'down'}`} />
              </Grid.Row>
            </Grid>
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[1]}>
            { (section === 'life' || section === 'vol_life') &&
            <LifeADDBenefits section={section} />
            }
            { (section === 'std' || section === 'vol_std') &&
            <StdBenefits section={section} />
            }
            { (section === 'ltd' || section === 'vol_ltd') &&
            <LtdBenefits section={section} />
            }
          </Accordion.Content>
        </Accordion>
      </div>
    );
  }
}
export default FirstColumn;
