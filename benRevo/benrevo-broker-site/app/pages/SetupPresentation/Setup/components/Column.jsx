import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Dropdown } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import Option from './Option';
import deleteCarrierImage from './../../../../assets/img/svg/deleteCarrier.svg';

class SetupColumn extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    title: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    percentage: PropTypes.number,
    presentationOptionId: PropTypes.string,
    data: PropTypes.array.isRequired,
    discounts: PropTypes.array,
    options: PropTypes.object,
    products: PropTypes.object.isRequired,
    showLabels: PropTypes.bool,
    updateAlternativeOption: PropTypes.func,
    deleteAlternative: PropTypes.func,
    deleteAlternativeOption: PropTypes.func,
    addDiscount: PropTypes.func,
    removeDiscount: PropTypes.func,
    updateDiscount: PropTypes.func,
    columnIndex: PropTypes.number.isRequired,
    columns: PropTypes.array.isRequired,
  };

  static defaultProps = {
    percentage: null,
    presentationOptionId: null,
    discounts: [],
    options: null,
    showLabels: false,
    updateAlternativeOption: () => {},
    deleteAlternative: () => {},
    deleteAlternativeOption: () => {},
    addDiscount: () => {},
    removeDiscount: () => {},
    updateDiscount: () => {},
  }

  getOption(product) {
    const { data } = this.props;

    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];

      if (item.product === product.toUpperCase() || item.category === product.toUpperCase()) return item;
    }

    return null;
  }

  render() {
    const {
      products,
      title,
      showLabels,
      total,
      index,
      percentage,
      options,
      updateAlternativeOption,
      presentationOptionId,
      deleteAlternative,
      deleteAlternativeOption,
      addDiscount,
      removeDiscount,
      updateDiscount,
      discounts,
      columnIndex,
      columns,
    } = this.props;
    let totalProducts = 0;
    const discountsProducts = [];
    const discountsPercents = [
      {
        key: 0.5,
        value: 0.5,
        text: '0.5%',
      },
      {
        key: 1,
        value: 1,
        text: '1%',
      },
    ];
    Object.keys(products).map((item) => {
      if (products[item] && item !== 'medical') {
        totalProducts += 1;
        discountsProducts.push({
          key: item,
          value: item.toUpperCase(),
          text: item,
        });
      }
      return false;
    });
    columns[columnIndex] = {};
    let showRemove = false;
    if (discounts && discounts.length &&
      ((discounts.length === 1 && (discounts[discounts.length - 1].product !== null || discounts[discounts.length - 1].discount !== null)) || discounts.length > 1)) {
      showRemove = true;
    }

    return (
      <div className="setup-page-column">
        <div className="setup-page-column-title">
          { title }
          { presentationOptionId && <Image className="remove-button" role="button" src={deleteCarrierImage} onClick={() => deleteAlternative(presentationOptionId, index)} /> }
        </div>
        { Object.keys(products).map((item) => {
          if (products[item]) {
            return <Option
              key={item}
              data={this.getOption(item)}
              product={item}
              options={options}
              updateAlternativeOption={updateAlternativeOption}
              deleteAlternativeOption={deleteAlternativeOption}
              showTitle={showLabels}
              presentationOptionId={presentationOptionId}
              isCurrent={title === 'Current'}
            />;
          }

          return null;
        })}
        <div className="setup-page-column-discounts" ref={(spanText) => { columns[columnIndex] = spanText; }}>
          { presentationOptionId &&
            <Grid>
              { discounts.map((item, i) =>
                <Grid.Row className="discounts-products" key={i}>
                  <Grid.Column width={9}>
                    <Dropdown
                      placeholder="Select"
                      search
                      selection
                      selectOnBlur={false}
                      options={discountsProducts}
                      value={item.product}
                      onChange={(e, inputState) => {
                        updateDiscount(i, index, 'product', inputState.value);
                      }}
                    />
                  </Grid.Column>
                  <Grid.Column width={7}>
                    <Dropdown
                      placeholder="-"
                      search
                      selection
                      selectOnBlur={false}
                      options={discountsPercents}
                      value={item.discount}
                      onChange={(e, inputState) => {
                        updateDiscount(i, index, 'discount', inputState.value);
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
              )}
              <Grid.Row className="discounts-actions">
                { totalProducts !== discounts.length &&
                  <Grid.Column width={showRemove ? 8 : 16} textAlign="center">
                    <a onClick={() => { addDiscount(index); }}>Add another</a>
                  </Grid.Column>
                }
                { showRemove &&
                  <Grid.Column width={totalProducts === discounts.length ? 16 : 8} textAlign="center">
                    <a onClick={() => { removeDiscount(index); }}>Remove last</a>
                  </Grid.Column>
                }
              </Grid.Row>
            </Grid>
          }
        </div>
        <div className="setup-page-column-total">
          <div className="option-title">{ showLabels && 'TOTALS' }</div>
          <Grid className="option-total">
            <Grid.Row>
              <Grid.Column width={8}>
                <FormattedNumber
                  style="currency" // eslint-disable-line react/style-prop-object
                  currency="USD"
                  minimumFractionDigits={0}
                  maximumFractionDigits={0}
                  fluid
                  value={total}
                />
              </Grid.Column>
              { title !== 'Current' &&
                <Grid.Column width={8}>
                  <span>{percentage}%</span>
                </Grid.Column>
              }
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default SetupColumn;
