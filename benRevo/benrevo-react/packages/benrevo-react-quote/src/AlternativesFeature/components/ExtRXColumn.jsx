import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Grid } from 'semantic-ui-react';
import { selectedIcon, selectedMatchIcon } from '@benrevo/benrevo-react-core';
import ExtRxTotal from './ExtRxTotal';
import RowHeader from './RowHeader';
import ItemValueTyped from './ItemValueTyped';

class ExtRXColumn extends React.Component {
  static propTypes = {
    section: PropTypes.string.isRequired,
    multiMode: PropTypes.bool.isRequired,
    carrier: PropTypes.object.isRequired,
    activeIndex: PropTypes.array.isRequired,
    plan: PropTypes.object.isRequired,
    bottomSeparatedRxSysName: PropTypes.array.isRequired,
    downloadPlanBenefitsSummary: PropTypes.func.isRequired,
    accordionClick: PropTypes.func.isRequired,
    editPlan: PropTypes.func.isRequired,
    setBorderRxColor: PropTypes.func.isRequired,
    selectNtRxPlan: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
  };

  render() {
    const {
      carrier,
      plan,
      section,
      editPlan,
      bottomSeparatedRxSysName,
      downloadPlanBenefitsSummary,
      accordionClick,
      index,
      multiMode,
      setBorderRxColor,
      selectNtRxPlan,
      activeIndex,
    } = this.props;
    return (
      <div className="alternatives-table-column">
        <div className="table-header-row rx-header-row">
          <RowHeader
            hideButtonRow
            network={false}
            section={section}
            downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
            additionalClassName={`${setBorderRxColor(plan)} ${plan.selected ? 'selected' : ''} ${plan.type} first-plan`}
            plan={plan}
            editPlan={() => editPlan(index)}
            multiMode={multiMode}
            carrier={carrier}
            isRX
          />
        </div>
        <Accordion defaultActiveIndex={0} className="external-rx-accordion">
          <Accordion.Title active={activeIndex[3]} onClick={() => accordionClick(3)}>
            <Grid key="selected-extrx-title" columns={2} className={`alt-table-column white ${setBorderRxColor(plan)} ${plan.selected ? 'selected' : ''} ${plan.type}`}>
              <Grid.Row className="center-aligned benefits-row">
                <Grid.Column />
              </Grid.Row>
            </Grid>
          </Accordion.Title>
          <Accordion.Content active={activeIndex[3]}>
            <Grid className="rx-row-body">
              <Grid.Column className={`alt-table-column first-plan white ${setBorderRxColor(plan)} ${plan.selected ? 'selected' : ''} ${plan.type}`}>
                {plan.rx.map((item, j) =>
                  <Grid columns={1} key={j} className={`${(bottomSeparatedRxSysName.includes(item.sysName) ? 'bottom-separated' : 'bottom-separated-light')}`}>
                    <Grid.Row className="center-aligned">
                      <Grid.Column className="on-col-rx content-col">
                        <ItemValueTyped item={item} />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                )}
              </Grid.Column>
            </Grid>
          </Accordion.Content>
        </Accordion>
        <div className="total">
          <Grid className="total-row-body">
            { plan.type !== 'current' &&
              <ExtRxTotal
                type={plan.type}
                setBorderRxColor={setBorderRxColor}
                plan={plan}
                selectedIcon={selectedIcon}
                selectNtRxPlan={selectNtRxPlan}
                selectedMatchIcon={selectedMatchIcon}
              />
            }
            { plan.type === 'current' &&
              <Grid.Column className={`alt-table-column first-plan ${setBorderRxColor(plan)} ${plan.selected ? 'selected' : ''} ${plan.type}`}>
                <Grid.Row className="center-aligned total-row last-row" />
              </Grid.Column>
            }
          </Grid>
        </div>
      </div>
    );
  }
}

export default ExtRXColumn;
