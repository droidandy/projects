import React from 'react';
import PropTypes from 'prop-types';
import { Header, Grid, Image, Button, Dimmer, Loader, Icon } from 'semantic-ui-react';
import { IconCheckImage } from '@benrevo/benrevo-react-core';
import OptionItem from './components/OptionItem';
import DiscountBanner from '../components/DiscountBanner';
import CarrierLogo from './../CarrierLogo';
import { PLAN_TYPE_MEDICAL } from './../constants';

class Compare extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    selected: PropTypes.number.isRequired,
    compareOptions: PropTypes.array.isRequired,
    changePage: PropTypes.func.isRequired,
    getCompare: PropTypes.func.isRequired,
    compareFile: PropTypes.func.isRequired,
    optionsSelect: PropTypes.func.isRequired,
    load: PropTypes.bool.isRequired,
    readonly: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const section = this.props.section;
    if (this.props.load) this.props.getCompare(section);
  }

  render() {
    const { section, readonly, changePage, compareOptions, selected, optionsSelect, compareFile } = this.props;
    const width = 250;
    return (
      <div className="presentation-compare">
        <Dimmer active={this.props.loading && !compareOptions.length} inverted>
          <Loader indeterminate size="big">Loading options for compare</Loader>
        </Dimmer>
        <div className="breadcrumb">
          <a tabIndex="0" onClick={() => { changePage(section, 'Options'); }}>{section} Options</a>
          <span>
            {' > '}
          </span>
          <a tabIndex="0" onClick={() => { changePage(section, 'Compare'); }}>Compare Options</a>
        </div>
        <div className="divider"></div>
        <div>
          <Header className="presentation-options-header" as="h2">Compare Options { section === PLAN_TYPE_MEDICAL && <DiscountBanner /> }</Header>
          {compareOptions.length > 0 &&
          <div className="action-button download-button">
            <a onClick={() => { compareFile(section); }}><Button primary className="download-excel">Download Excel</Button></a>
            <Loader inline active={this.props.loading} />
          </div>
          }
        </div>
        {compareOptions.length > 0 &&
          <div style={{ width: `${((width * compareOptions.length) + width)}px` }}>
            <Grid className="compare-table compare-table-top">
              <Grid.Row className="compare-option-row">
                <Grid.Column className="compare-table-column compare-option-head">

                </Grid.Column>
                {compareOptions.map((item, i) => (
                  <Grid.Column key={i} className="compare-table-column compare-option compare-option-head" textAlign="center">
                    <div className="compare-item-type">{item.name}</div>
                    <CarrierLogo carrier={item.carrier} quoteType={item.quoteType} section={section} />
                  </Grid.Column>
                ))}
              </Grid.Row>
            </Grid>
            {compareOptions[0] && compareOptions[0].plans.map((item, i) => {
              let plan;

              if (item.networkPlan) plan = item;
              else if (compareOptions[1] && compareOptions[1].plans[i].networkPlan) plan = compareOptions[1].plans[i];
              else if (compareOptions[2] && compareOptions[2].plans[i].networkPlan) plan = compareOptions[2].plans[i];

              const valueInOutRow = plan.networkPlan.benefits[0].valueIn || '';

              return (<OptionItem key={i} plan={plan} compareOptions={compareOptions} valueInOutRow={valueInOutRow} planIndex={i} />);
            })}
            <Grid className="compare-table compare-table-bottom">
              <Grid.Row className="compare-option-row">
                <Grid.Column className="compare-table-column compare-option-head">

                </Grid.Column>
                {compareOptions.map((item, i) => (
                  <Grid.Column key={i} className="compare-table-column compare-option compare-option-head" textAlign="center">
                    <div className="compare-item-type">{item.name}</div>
                    <CarrierLogo carrier={item.carrier} quoteType={item.quoteType} section={section} />
                    <div className="option-cart">
                      { item.rfpQuoteOptionId === selected &&
                      <div>
                        <Image src={IconCheckImage} />
                        In cart
                      </div>
                      }
                      { item.rfpQuoteOptionId !== selected && item.name !== 'Current' && !readonly &&
                      <div>
                        <Button className="add-to-cart-button blue" onClick={() => { optionsSelect(section, item.rfpQuoteOptionId); }}>Add to cart</Button>
                      </div>
                      }
                    </div>
                  </Grid.Column>
                ))}
              </Grid.Row>
            </Grid>
          </div>
        }
      </div>
    );
  }
}

export default Compare;
