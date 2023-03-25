import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Grid } from 'semantic-ui-react';
import lifeCostList from '../../../components/CostComponents/lifeCostList';
import lifeBenefitsList from '../../../components/BenefitsComponents/lifeBenefitsList';
import volLifeCostList from '../../../components/CostComponents/volLifeCostList';
import volLifeBenefitsList from '../../../components/BenefitsComponents/volLifeBenefitsList';
import stdCostList from '../../../components/CostComponents/stdCostList';
import stdBenefitsList from '../../../components/BenefitsComponents/stdBenefitsList';
import volStdCostList from '../../../components/CostComponents/volStdCostList';
import volStdBenefitsList from '../../../components/BenefitsComponents/volStdBenefitsList';
import ltdBenefitsList from '../../../components/BenefitsComponents/ltdBenefitsList';
import ltdCostList from '../../../components/CostComponents/ltdCostList';
import volLtdBenefitsList from '../../../components/BenefitsComponents/volLtdBenefitsList';
import volLtdCostList from '../../../components/CostComponents/volLtdCostList';

class CurrentPlanEmpty extends React.Component {
  static propTypes = {
    externalRX: PropTypes.bool,
    accordionClick: PropTypes.func.isRequired,
    accordionActiveIndex: PropTypes.array.isRequired,
    editBenefitInfo: PropTypes.func,
    section: PropTypes.string,
  };

  static defaultProps = {
    externalRX: false,
    detailedPlanType: 'HMO',
    editBenefitInfo: null,
    plan: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      emptyPlanTemplate: {},
    };
  }

  componentDidMount() {
    this.setBenefits(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setBenefits(nextProps);
  }

  setBenefits(props) {
    const {
      section,
      // currentPlan,
      detailedPlan,
      planTypeTemplates,
      plan,
    } = props;
    let cost = [];
    if (section === 'life') {
      cost = lifeCostList;
    }
    if (section === 'vol_life') {
      cost = volLifeCostList;
    }
    if (section === 'std') {
      cost = stdCostList;
    }
    if (section === 'vol_std') {
      cost = volStdCostList;
    }
    if (section === 'ltd') {
      cost = ltdCostList;
    }
    if (section === 'vol_ltd') {
      cost = volLtdCostList;
    }
    const emptyPlanTemplate = {
      cost,
    };
    if ((section !== 'medical' && section !== 'dental' && section !== 'vision') && !emptyPlanTemplate.benefits) {
      if (section === 'life') {
        emptyPlanTemplate.benefits = lifeBenefitsList;
        this.setState({ emptyPlanTemplate });
      }
      if (section === 'vol_life') {
        emptyPlanTemplate.benefits = volLifeBenefitsList;
        this.setState({ emptyPlanTemplate });
      }
      if (section === 'std') {
        emptyPlanTemplate.benefits = stdBenefitsList;
        this.setState({ emptyPlanTemplate });
      }
      if (section === 'vol_std') {
        emptyPlanTemplate.benefits = volStdBenefitsList;
        this.setState({ emptyPlanTemplate });
      }
      if (section === 'ltd') {
        emptyPlanTemplate.benefits = ltdBenefitsList;
        this.setState({ emptyPlanTemplate });
      }
      if (section === 'vol_ltd') {
        emptyPlanTemplate.benefits = volLtdBenefitsList;
        this.setState({ emptyPlanTemplate });
      }
    } else {
      const detailedPlanType = props.detailedPlanType || 'HMO';
      if (plan && plan.cost) {
        cost = plan.cost;
      }
      if ((!cost || !cost.length) && detailedPlan.newPlan && detailedPlan.newPlan.cost) {
        cost = detailedPlan.newPlan.cost;
      }
      if ((!cost || !cost.length) && detailedPlan.secondNewPlan && detailedPlan.secondNewPlan.cost) {
        cost = detailedPlan.secondNewPlan.cost;
      }
      if (!cost || !cost.length) {
        cost = [
          {
            name: 'Monthly cost',
            sysName: '',
            type: 'DOLLAR',
          },
          {
            name: 'Employee Only',
            sysName: '',
            type: 'DOLLAR',
          },
          {
            name: 'Employee + Spouse',
            sysName: '',
            type: 'DOLLAR',
          },
          {
            name: 'Employee + Child(ren)',
            sysName: '',
            type: 'DOLLAR',
          },
          {
            name: 'Employee + Family',
            sysName: '',
            type: 'DOLLAR',
          },
        ];
      }
      emptyPlanTemplate.cost = cost;
      if (plan && plan.benefits) {
        emptyPlanTemplate.benefits = plan.benefits;
      }
      if (planTypeTemplates[detailedPlanType]) {
        const tamplateBenefits = Object.values(planTypeTemplates[detailedPlanType]);
        emptyPlanTemplate.benefits = [];
        tamplateBenefits.forEach((item) => {
          emptyPlanTemplate.benefits.push(item);
        });
      }
      if (plan && plan.rx) {
        emptyPlanTemplate.rx = plan.rx;
      }
      this.setState({ emptyPlanTemplate });
    }
  }

  getContainerClassNames(section, columnName) {
    const baseClass = columnName === 'emptyLifePlan' ?
    'alternatives-table-column current current-empty' :
    'alt-table-column white cost-body';
    if (['life', 'std', 'ltd', 'vol_life', 'vol_std', 'vol_ltd'].indexOf(section) !== -1) {
      return `${baseClass} life ${section}`;
    }
    return baseClass;
  }

  render() {
    const {
      externalRX,
      accordionClick,
      accordionActiveIndex,
      editBenefitInfo,
      section,
    } = this.props;

    const { emptyPlanTemplate } = this.state;
    const bigRow = false;
    // console.log('currentPlanEmpty', this.props, 'emptyPlanTemplate', emptyPlanTemplate);
    return (
      <div className={this.getContainerClassNames(section, 'emptyLifePlan')}>
        <div className="table-header-row">
          <div className="row-header row-header-main header-column alt-table-column">
            <div className={editBenefitInfo ? 'logo-row edit-benefits' : 'logo-row'}>
              <span>No incumbent plan</span>
            </div>
            <div className="plan-name-row">
              <div className="long-line" />
              <div className="long-line" />
            </div>
          </div>
        </div>
        {(emptyPlanTemplate.cost && emptyPlanTemplate.cost.length > 0) &&
        <Accordion>
          <Accordion.Title active={accordionActiveIndex[0]} onClick={() => accordionClick(0)}>
            <div className="cost-title">
              <div className="long-line" />
              <div className="long-line" />
            </div>
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[0]}>
            <Grid className="cost-row-body">
              <Grid.Column className={this.getContainerClassNames(section, 'costBodyLife')}>
                {emptyPlanTemplate.cost && emptyPlanTemplate.cost.map((item, j) => {
                  if (item.name !== '% change from current') {
                    return (
                      <div className="cost-empty-item" key={j}>
                        <div className="short-line" />
                      </div>
                    );
                  }
                  return null;
                })}
              </Grid.Column>
            </Grid>
          </Accordion.Content>
        </Accordion>
        }
        {(emptyPlanTemplate.benefits && emptyPlanTemplate.benefits.length > 0) &&
        <Accordion className={`benefits-accordion ${(externalRX) ? 'bottom' : ''}`}>
          <Accordion.Title active={accordionActiveIndex[1]} onClick={() => accordionClick(1)}>
            <div className="benefits-empty-head"></div>
            {section === 'medical' &&
              <Grid className="benefits-row-body head-benefits">
              <Grid.Column className="alt-table-column white benefits-body">
                { (section !== 'medical' && section !== 'dental' && section !== 'vision') &&
                <Grid.Row>
                  <Grid.Column className="one-col benefits row-name content-col white emptyCurrent">
                  </Grid.Column>
                </Grid.Row>
                }
                {emptyPlanTemplate.benefits && emptyPlanTemplate.benefits.map((item, j) => {
                  if(j > 5){
                    return;
                  }
                  return (<div className="benefits-empty-item" key={j}>
                    <div className="short-line" />
                  </div>)
                })}
              </Grid.Column>
            </Grid>
            }
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[1]}>
            <Grid className="benefits-row-body">
              <Grid.Column className="alt-table-column white benefits-body">
                { (section !== 'medical' && section !== 'dental' && section !== 'vision') &&
                <Grid.Row>
                  <Grid.Column className="one-col benefits row-name content-col white emptyCurrent">
                  </Grid.Column>
                </Grid.Row>
                }
                {emptyPlanTemplate.benefits && emptyPlanTemplate.benefits.map((item, j) => {
                  if(section === 'medical' && j <= 5){
                    return;
                  }
                  return (<div className="benefits-empty-item" key={j}>
                    <div className="short-line" />
                  </div>)
                })}
              </Grid.Column>
            </Grid>
          </Accordion.Content>
        </Accordion>
        }
        {(emptyPlanTemplate.rx && emptyPlanTemplate.rx.length > 0) &&
        <Accordion className="rx-accordion">
          <Accordion.Title active={accordionActiveIndex[2]} onClick={() => accordionClick(2)}>
            <div className="rx-empty-head big">
              <div className="short-line" />
            </div>
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[2]}>
            <div className="rx-empty-body">
              {emptyPlanTemplate.rx && emptyPlanTemplate.rx.map((item, j) =>
                <div className="rx-empty-item" key={j}>
                  <div className="short-line" />
                </div>
              )}
            </div>
          </Accordion.Content>
        </Accordion>
        }
        {/* More, Less, BenefitsSummary, Selected blocks */}
        <div className="details">
          <Grid.Column className="alt-table-column">
            <div className={`empty-footer ${bigRow ? 'big' : ''}`} />
          </Grid.Column>
        </div>
      </div>
    );
  }
}

export default CurrentPlanEmpty;
