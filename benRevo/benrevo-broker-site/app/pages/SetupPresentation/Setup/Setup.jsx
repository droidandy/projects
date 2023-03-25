import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Header, Grid, Button } from 'semantic-ui-react';
import { AlternativesCounter } from '@benrevo/benrevo-react-quote';
import { ToggleButton } from '@benrevo/benrevo-react-core';
import Column from './components/Column';
import { WithScrollbar } from './components/ScrollBarFunction';


class Setup extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    client: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    currentTotal: PropTypes.number.isRequired,
    renewalTotal: PropTypes.number.isRequired,
    renewalPercentage: PropTypes.number.isRequired,
    currents: PropTypes.array.isRequired,
    renewals: PropTypes.array.isRequired,
    alternatives: PropTypes.array.isRequired,
    getPresentationOptions: PropTypes.func.isRequired,
    createAlternative: PropTypes.func.isRequired,
    updateAlternativeOption: PropTypes.func.isRequired,
    getOptions: PropTypes.func.isRequired,
    deleteAlternative: PropTypes.func.isRequired,
    deleteAlternativeOption: PropTypes.func.isRequired,
    addDiscount: PropTypes.func.isRequired,
    removeDiscount: PropTypes.func.isRequired,
    updateDiscount: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      mainIndex: 0,
      showCurrent: true,
    };
    this.columns = [];
    this.blankBlock = null;

    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.getCount = this.getCount.bind(this);
    this.leftMove = this.leftMove.bind(this);
    this.rightMove = this.rightMove.bind(this);
    this.changeView = this.changeView.bind(this);
  }

  componentWillMount() {
    const { getPresentationOptions, products, getOptions } = this.props;
    getPresentationOptions();

    for (let i = 0; i < Object.keys(products).length; i += 1) {
      const key = Object.keys(products)[i];

      if (products[key]) {
        getOptions(key);
      }
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.getCount);
    this.getCount();
  }

  componentDidUpdate() {
    let maxHeight = 0;
    const blankBlockInitialHeight = 139;

    if (this.columns && this.columns.length > 0){
      this.columns.forEach((columnItem) => {
        if (columnItem && columnItem.children && columnItem.children.length > 0 && maxHeight < columnItem.children[0].offsetHeight) { 
          maxHeight = columnItem.children[0].offsetHeight;
        }
      });
      this.columns.forEach((columnItem, ind) => {
        if (this.columns[ind] && this.columns[ind].style) {
          this.columns[ind].style.height = `${maxHeight}px`;
        }
      });
      if (this.blankBlock && this.blankBlock.style && maxHeight > blankBlockInitialHeight) {
        this.blankBlock.style.height = `${maxHeight - 1}px`;
      } else {
        this.blankBlock.style.height = `${blankBlockInitialHeight}px`;
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getCount);
  }

  getCount() {
    const small = window.innerWidth < 1200;
    const smallest = window.innerWidth < 1000;
    let count = 0;
    const mainIndex = 0;
    if (this.mainListInner) {
      this.mainListInner.style.transform = 'translate(0px, 0px)';
    }
    if (smallest) {
      count = (!this.state.currentPlanIndex || this.state.currentPlanIndex === null) ? 3 : 3;
    } else if (small) {
      count = (!this.state.currentPlanIndex || this.state.currentPlanIndex === null) ? 3 : 3;
    } else {
      count = (!this.state.currentPlanIndex || this.state.currentPlanIndex === null) === null ? 4 : 4;
    }

    this.setState({ count, mainIndex });
    if (this.counter) { // eslint-disable-line react/no-string-refs
      this.counter.setCount(count, mainIndex); // eslint-disable-line react/no-string-refs
      this.counter.clear(); // eslint-disable-line react/no-string-refs
    }
    if (this.sliderHeader) this.leftMove(null, null, true);
  }

  leftMove(e, target, notUpdateCounter) {
    if (this.state.mainIndex === 0) return;
    let mainIndex = this.state.mainIndex - this.state.count;
    if (mainIndex < 0) mainIndex = 0;
    if (!notUpdateCounter) {
      this.counter.updateCount('prev');
    } // eslint-disable-line react/no-string-refs
    this.setState({ mainIndex });
    this.changeSlider(mainIndex);
  }

  rightMove() {
    const { alternatives } = this.props;
    const { showCurrent } = this.state;
    const plansLength = alternatives.length + (showCurrent ? 2 : 0);
    let mainIndex = this.state.mainIndex + this.state.count;
    if (mainIndex >= plansLength && plansLength - mainIndex <= this.state.count) {
      mainIndex -= this.state.count;
      return;
    } else if (mainIndex > plansLength) mainIndex = plansLength;
    this.counter.updateCount('next'); // eslint-disable-line react/no-string-refs
    this.setState({ mainIndex });

    this.changeSlider(mainIndex);
  }

  changeSlider(mainIndex) {
    if (this.mainListInner) {
      this.mainListInner.style.transform = `translate(-${230 * (mainIndex)}px, 0px)`;
    }
  }

  changeView(checked) {
    this.setState({ showCurrent: checked });
  }

  render() {
    const {
      client,
      currents,
      renewals,
      alternatives,
      products,
      currentTotal,
      renewalTotal,
      renewalPercentage,
      createAlternative,
      updateAlternativeOption,
      deleteAlternative,
      deleteAlternativeOption,
      addDiscount,
      removeDiscount,
      updateDiscount,
      options,
    } = this.props;
    const { showCurrent } = this.state;
    const optionsScrollBar = {
      handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
      wheelPropagation: true,
    };
    const scrollBarActivate = window.innerWidth < 1000;
    return (
      <div className="setup-page">
        <div>
          <Header className="presentation-options-header setup-header" as="h2">Setup and preview presentation</Header>
        </div>
        <Grid className="instructions" stackable>
          <Grid.Row>
            <Grid.Column width={16}>
              <div className="instructions-title">Instructions</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column tablet={6} mobile={6} computer={4}>
              1. Current / Renewal:
            </Grid.Column>
            <Grid.Column tablet={10} mobile={10} computer={12}>
              Your presentation <b>will automatically show current and renewal,</b>  which will be the basis for comparison.
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column tablet={6} mobile={6} computer={4}>
              2. Alternative(s):
            </Grid.Column>
            <Grid.Column tablet={10} mobile={10} computer={12}>
              Use the <b>drop-down lists below to select what option(s)</b> will be displayed as alternatives for your client presentation. A ﬁnancial summary for each alternative grouping of plans will also be included.
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className="top">
          <div className="top-left">
            <div className="toggle-title">Show Current & Renewal</div>
            <ToggleButton leftValue="" showCheck checked={showCurrent} onChange={this.changeView} />
          </div>
          <div className="top-right">
            <AlternativesCounter
              ref={(e) => { this.counter = e; }} // eslint-disable-line react/no-string-refs
              total={(showCurrent ? 2 : 0) + alternatives.length}
              onPrev={this.leftMove}
              onNext={this.rightMove}
            />
            <Button
              as="a"
              className="add-button"
              circular
              size="medium"
              onClick={() => {
                const lengthOfScroll = this.props.alternatives.length;
                createAlternative();
                this.counter.setState({ mainIndex: Math.floor((lengthOfScroll - 2) / this.state.count) });
                this.setState({ mainIndex: (lengthOfScroll + 2) - this.state.count });
                this.changeSlider(lengthOfScroll + 2 - this.state.count);
              }}
            />
          </div>
        </div>
        <WithScrollbar enableScrollBar={scrollBarActivate} optionsScrollBar={optionsScrollBar} refs={(c) => { this.scrollBar = c; }}>
          <div className="alternatives-scrolling">
            <div ref={(c) => { this.mainListInner = c; }} className="alternatives-inner">
              { showCurrent &&
              <Column
                index={0}
                columnIndex={0}
                columns={this.columns}
                title="Current"
                data={currents}
                products={products}
                showLabels
                total={currentTotal}
              />
              }
              { showCurrent &&
              <Column
                index={0}
                columnIndex={1}
                columns={this.columns}
                title="Renewal"
                data={renewals}
                products={products}
                total={renewalTotal}
                percentage={renewalPercentage}
              />
              }
              { alternatives.map((item, i) =>
                <Column
                  columnIndex={i + 2}
                  columns={this.columns}
                  key={i}
                  index={i}
                  title={item.name}
                  showLabels={!showCurrent && i === 0}
                  data={item.productsOptions}
                  discounts={item.bundlingDiscounts}
                  presentationOptionId={item.presentationOptionId}
                  updateAlternativeOption={updateAlternativeOption}
                  deleteAlternative={deleteAlternative}
                  deleteAlternativeOption={deleteAlternativeOption}
                  addDiscount={addDiscount}
                  removeDiscount={removeDiscount}
                  updateDiscount={updateDiscount}
                  options={options}
                  products={products}
                  total={item.total}
                  percentage={item.percentage}
                />
              )}
            </div>
          </div>
        </WithScrollbar>
        <div className="blank-block" ref={(elem) => { this.blankBlock = elem; }}>
          <div className="blank-block-title">
            <span className="option-title">ADD BUNDLE DISCOUNT</span>
            <span className="arrow" />
          </div>
        </div>
        <div className="footer">
          <Button as={Link} to={`/clients/${client.id}/build/download`} primary size="big">Continue</Button>
        </div>
      </div>
    );
  }
}

export default Setup;
