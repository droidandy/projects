import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Accordion, Image } from 'semantic-ui-react';
import {
  ArrowUp,
} from '@benrevo/benrevo-react-core';
import RXBody from './RxBody';

class FirstColumn extends React.Component {
  static propTypes = {
    planTemplate: PropTypes.object.isRequired,
    attributes: PropTypes.object,
    accordionActiveIndex: PropTypes.array.isRequired,
    showExtRX: PropTypes.bool,
    accordionClick: PropTypes.func.isRequired,
    detailedPlanType: PropTypes.string,
    planTypeTemplates: PropTypes.object.isRequired,
    editBenefitInfo: PropTypes.func,
    rxPlanTemplate: PropTypes.object,
    optionName: PropTypes.bool,
    externalRX: PropTypes.bool,
    section: PropTypes.string.isRequired,
  };

  static defaultProps = {
    showExtRX: false,
    detailedPlanType: null,
    editBenefitInfo: null,
    rxPlanTemplate: null,
    optionName: false,
    externalRX: false,
    attributes: [],
  };

  render() {
    const {
      section,
      attributes,
      planTemplate,
      accordionActiveIndex,
      showExtRX,
      accordionClick,
      planTypeTemplates,
      editBenefitInfo,
      rxPlanTemplate,
      optionName,
      externalRX,
    } = this.props;
    const emptyPlanTemplate = planTemplate;
    const detailedPlanType = this.props.detailedPlanType || 'HMO';
    const rxDetailedPlanType = `RX_${(this.props.detailedPlanType && this.props.detailedPlanType !== 'HMO') ? this.props.detailedPlanType : 'HMO'}`;
    if (!Object.keys(planTemplate).length && planTypeTemplates[detailedPlanType]) {
      const tamplateBenefits = Object.values(planTypeTemplates[detailedPlanType]);
      const tamplateRx = planTypeTemplates[rxDetailedPlanType] ? Object.values(planTypeTemplates[rxDetailedPlanType]) : [];
      emptyPlanTemplate.benefits = [];
      tamplateBenefits.forEach((item) => {
        emptyPlanTemplate.benefits.push(item);
      });
      emptyPlanTemplate.rx = [];
      tamplateRx.forEach((item) => {
        emptyPlanTemplate.rx.push(item);
      });
      if (!emptyPlanTemplate.cost || !emptyPlanTemplate.cost.length) {
        emptyPlanTemplate.cost = [
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
        ]
      }
    }
    return (
      <div className="alternatives-titles">
        <div className="table-header-row">
          <div className="alt-table-column first first-column">
            <Grid columns={1}>
              <Grid.Row className={editBenefitInfo ? 'edit-benefits logo-row' : 'logo-row'} />
            </Grid>
            { optionName &&
            <Grid columns={1} className="option-name">
              <Grid.Row className="plan-name-row empty">
                OPTION NAME
              </Grid.Row>
            </Grid>
            }
            <Grid columns={1}>
              <Grid.Row className="plan-name-row empty">
                PLAN NAME
              </Grid.Row>
            </Grid>
            {Object.keys(attributes).map((item, key) =>
              <Grid columns={1} key={key}>
                <Grid.Row className="plan-name-row empty plan-name-attrs">
                  {attributes[item]}
                </Grid.Row>
              </Grid>
            )}
          </div>
        </div>
        {(!showExtRX && emptyPlanTemplate.cost && emptyPlanTemplate.cost.length > 0) &&
        <Accordion>
          <Accordion.Title active={accordionActiveIndex[0]} onClick={() => accordionClick(0)}>
            <Grid className="alt-table-column first first-column">
              <Grid.Row className="cost-row">
                COST
                {/* <Image className="icon-image" src={ArrowDown} /> */}
                <Image className={`icon-image ${accordionActiveIndex[0] ? 'up' : 'down'}`} src={ArrowUp} />
              </Grid.Row>
            </Grid>
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[0]}>
            <Grid className="cost-row-body">
              <Grid.Column className="alt-table-column first first-column">
                {emptyPlanTemplate.cost.map((item, j) => {
                  if (item.name !== '% change from current') {
                    return (
                      <Grid columns={1} key={j} className="value-row">
                        <Grid.Row className="right-aligned" />
                      </Grid>
                    );
                  }
                  return null;
                })}
              </Grid.Column>
            </Grid>
          </Accordion.Content>
        </Accordion>
        }
        {(!showExtRX && emptyPlanTemplate.benefits && emptyPlanTemplate.benefits.length > 0) &&
        <Accordion className={`${(showExtRX) ? 'bottom' : ''}`}>
          <Accordion.Title active={accordionActiveIndex[1]} onClick={() => accordionClick(1)}>
            <Grid className="alt-table-column first first-column">
              <Grid.Row className="benefits-row">
                BENEFITS
                <Image src={ArrowUp} className={`icon-image ${accordionActiveIndex[1] ? 'up' : 'down'}`} />
              </Grid.Row>
            </Grid>
            {section === 'medical' &&
              <Grid className="benefits-row-body head-benefits">
              <Grid.Column className={`alt-table-column first first-column`}>
                {emptyPlanTemplate.benefits.map((item, j) => {
                  if(j > 5){
                    return;
                  }
                  return (<Grid columns={1} key={j} className="bottom-separated">
                    <Grid.Row>
                      <Grid.Column className="one-col benefits row-name content-col white">
                        {item.name}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>)
                })}
              </Grid.Column>
            </Grid>
            }
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[1]}>
            <Grid className="benefits-row-body">
              <Grid.Column className={`alt-table-column first first-column`}>
                {emptyPlanTemplate.benefits.map((item, j) => {
                  if(section === 'medical' && j <= 5){
                    return;
                  }
                  return (<Grid columns={1} key={j} className="bottom-separated">
                    <Grid.Row>
                      <Grid.Column className="one-col benefits row-name content-col white">
                        {item.name}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>)
                })}
              </Grid.Column>
            </Grid>
          </Accordion.Content>
        </Accordion>
        }
        {(!showExtRX && !externalRX && emptyPlanTemplate.rx && emptyPlanTemplate.rx.length > 0) &&
        <Accordion>
          <Accordion.Title active={accordionActiveIndex[2]} onClick={() => accordionClick(2)}>
            <Grid className="alt-table-column first first-column">
              <Grid.Row className="rx-row big">
                RX
                <Image className={`icon-image ${accordionActiveIndex[2] ? 'up' : 'down'}`} src={ArrowUp} />
              </Grid.Row>
            </Grid>
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[2]}>
            <Grid className="rx-row-body">
              <RXBody
                plan={emptyPlanTemplate}
                rxClassName="alt-table-column first first-column"
                rxColumnClassName="one-col benefits row-name content-col"
                rxRowType="name"
              />
            </Grid>
          </Accordion.Content>
        </Accordion>
        }
        {showExtRX &&
        <Accordion>
          <Accordion.Title active={accordionActiveIndex[4]} onClick={() => accordionClick(4)}>
            <Grid className="alt-table-column first first-column">
              <Grid.Row className="rx-row">
                RX BENEFITS
                <Image className={`icon-image ${accordionActiveIndex[4] ? 'up' : 'down'}`} src={ArrowUp} />
              </Grid.Row>
            </Grid>
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[4]}>
            <Grid className="rx-row-body">
              <RXBody
                plan={rxPlanTemplate}
                rxClassName="alt-table-column first first-column"
                rxColumnClassName="one-col benefits row-name content-col"
                rxRowType="name"
              />
            </Grid>
          </Accordion.Content>
        </Accordion>
        }
      </div>
    );
  }
}
export default FirstColumn;
