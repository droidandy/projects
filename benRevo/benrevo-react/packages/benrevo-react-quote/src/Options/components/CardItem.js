import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, Checkbox, Header } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import { getCarrier } from './../../utils';
import CarrierLogo from './../../CarrierLogo';

class CardItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string,
    selected: PropTypes.number,
    isCurrent: PropTypes.bool,
    notSubmitted: PropTypes.bool,
    declined: PropTypes.bool,
    readonly: PropTypes.bool,
    checkedOptions: PropTypes.array,
    carrierList: PropTypes.array,
    index: PropTypes.number,
    data: PropTypes.object.isRequired,
    mainCarrier: PropTypes.object,
    changePage: PropTypes.func,
    optionCheck: PropTypes.func,
    optionsSelect: PropTypes.func,
    optionsDelete: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.optionsDelete = this.optionsDelete.bind(this);
  }

  optionsDelete() {
    this.props.optionsDelete(this.props.section, this.props.data.id);
  }

  render() {
    const { readonly, isCurrent, data, changePage, checkedOptions, optionCheck, optionsSelect, section, selected, carrierList, mainCarrier, notSubmitted, declined } = this.props;

    const carrier = getCarrier(carrierList, data.carrier) || mainCarrier;
    if (!data.planTypes) data.planTypes = [];
    let index = this.props.index;
    let checked = false;
    let className = (isCurrent) ? 'card-current' : `card-option card-${index + 1}`;
    const isSelected = selected === data.id;
    let showAdd = (!isCurrent && !readonly) || isSelected;
    const showRemove = !isCurrent && data.name !== 'Option 1' && data.name !== 'Renewal 1' && data.name !== 'Renewal 2' && (!readonly || !isSelected);

    if (showAdd && declined) showAdd = false;

    const maxNetworks = 5;
    if (isSelected) className += ' active';
    if (showAdd || isSelected) className += ' is-add';

    checkedOptions.map((item) => {
      if (item === data.id) {
        checked = true;
        return checked;
      }

      return false;
    });

    return (
      <Card as="div" className={className}>
        { !notSubmitted && !declined && <span className="checkbox-compare"><Checkbox label="Add to Compare" checked={checked} onChange={() => { optionCheck(section, data); }} /></span> }
        { showRemove && <a role="button" tabIndex="0" className="remove-card" onClick={this.optionsDelete}>X</a> }
        <a className="card-link" tabIndex="0" onClick={() => { if (changePage) changePage('Overview', data.readOnly, index += 1, data.id, carrier); }}>
          <Card.Content className="content-top">
            <Card.Header>
              {data.name}
            </Card.Header>
            { !notSubmitted && <CarrierLogo carrier={data.carrier} quoteType={data.quoteType} section={section} /> }
            <Card.Description>
              <Grid textAlign="center">
                <Grid.Row>
                  { !notSubmitted && !declined &&
                    <Grid.Column className="card-price-value" width="10">
                      <FormattedNumber
                        style="currency" // eslint-disable-line react/style-prop-object
                        currency="USD"
                        minimumFractionDigits={0}
                        maximumFractionDigits={0}
                        value={data.totalAnnualPremium}
                      />
                      <div className="sub-description">total annual premium</div>
                    </Grid.Column>
                  }
                  { notSubmitted && <div className="sub-description not-submitted">(<span>{section}</span> RFP not submitted)</div>}
                  { declined && <div className="sub-description not-submitted declined">(Declined to Quote)</div>}
                  { !isCurrent && !declined &&
                    <Grid.Column width="6">
                      {data.percentDifference}
                      <sup className="percent">%</sup>
                      <div className="sub-description">difference</div>
                    </Grid.Column>
                  }
                </Grid.Row>
              </Grid>
            </Card.Description>
          </Card.Content>
          <Card.Content extra className="content-bottom">
            <Header as="h5">Plan types</Header>
            <div className="labels">
              { data.planTypes.map((item, i) => (i < maxNetworks) ? <span key={i}>{item}</span> : null)}
            </div>
          </Card.Content>
        </a>
        { showAdd &&
        <a tabIndex="0" className={'card-button'} onClick={() => { if (!isSelected) optionsSelect(section, data.id); }}>
          {!isSelected && <span>Add Option to Cart</span>}
          {isSelected && <span className="added-to-cart">Added to Cart</span>}
        </a>
        }
      </Card>
    );
  }
}

export default CardItem;
