import React from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router';
import { TOTAL, SOLD, QUOTED, COMPETITIVE } from '../constants';

class FunnelCard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    productsList: PropTypes.array.isRequired,
    product: PropTypes.string.isRequired,
    getFunnelData: PropTypes.func.isRequired,
    funnelData: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.drawShape1 = this.drawShape1.bind(this);
    this.drawShape2 = this.drawShape2.bind(this);
  }

  componentWillMount() {
    this.props.getFunnelData(this.props.product);
  }

  componentDidMount() {
    const { funnelData } = this.props;
    // These are converted to percentages for rendering graph
    if (funnelData[TOTAL]) {
      let totalValue = Object.keys(funnelData[TOTAL])[0];
      let quotedValue = ((parseInt(Object.keys(funnelData[QUOTED])[0], 10) + parseInt(Object.keys(funnelData[SOLD])[0], 10)) / totalValue) * 100;
      let competitiveValue = (Object.keys(funnelData[COMPETITIVE])[0] / totalValue) * 100;
      let soldValue = (Object.keys(funnelData[SOLD])[0] / totalValue) * 100;

      // totalValue will always be 100 if not 0
      if (totalValue !== 0) {
        totalValue = 100;
      }
      if (quotedValue < 10 && quotedValue > 0) {
        quotedValue = 10;
      }
      if (competitiveValue < 10 && competitiveValue > 0) {
        competitiveValue = 10;
      }
      if (soldValue < 10 && soldValue > 0) {
        soldValue = 10;
      }

      // the rest must be a minimum of 5, so do if statements on assignment
      const totalShape = this.totalShape;
      const quotedShape = this.quotedShape;
      const competitiveShape = this.competitiveShape;
      const soldShape = this.soldShape;
      const width = totalShape.width;
      const height = totalShape.height;

    // Draw shape for total groups
      const totalContext = totalShape.getContext('2d');
      totalContext.clearRect(0, 0, width, height);
      if (totalValue > 0) {
        this.drawShape1(totalContext, width, height, '#0099cc', totalValue, quotedValue);
      }

      // Draw shape for quoted groups
      const quotedContext = quotedShape.getContext('2d');
      quotedContext.clearRect(0, 0, width, height);
      if (quotedValue > 0) {
        this.drawShape2(quotedContext, width, height, '#6ec5e2', quotedValue, competitiveValue);
      }

      // Draw shape for competitive groups
      const competitiveContext = competitiveShape.getContext('2d');
      competitiveContext.clearRect(0, 0, width, height);
      if (competitiveValue > 0) {
        this.drawShape1(competitiveContext, width, height, '#b3e1f0', competitiveValue, soldValue);
      }

      // Draw shape for sold groups
      const soldContext = soldShape.getContext('2d');
      soldContext.clearRect(0, 0, width, height);
      if (soldValue > 0) {
        this.drawShape2(soldContext, width, height, '#82c58a', soldValue, soldValue);
      }
    }
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  drawShape1(ctx, width, height, color, start, end) {
    const context = ctx;
    context.beginPath();
    context.moveTo(0, 100 - start);
    context.bezierCurveTo(width / 3, (100 - start), width / 2, 100 - start, width, 100 - end);
    context.lineTo(width, height - (100 - end));
    context.bezierCurveTo(width / 2, height - (100 - start), width / 3, height - (100 - start), 0, height - (100 - start));

    context.closePath();
    context.fillStyle = color;
    context.fill();
  }

  drawShape2(ctx, width, height, color, start, end) {
    const context = ctx;
    context.beginPath();

    context.moveTo(0, 100 - start);
    context.bezierCurveTo(width / 2, (110 - end), width / 2, (110 - end), width, (100 - end));
    context.lineTo(width, height - (100 - end));
    context.bezierCurveTo(width / 2, height - (110 - end), width / 2, height - (110 - end), 0, height - (100 - start));

    context.closePath();
    context.fillStyle = color;
    context.fill();
  }

  render() {
    const { productsList, product, getFunnelData, funnelData, setFilters } = this.props;
    return (
      <Card className="card-main" fluid>
        <Card.Content>
          <Card.Header>
            Clients
            <div className="header-actions">
              <Dropdown
                search
                selection
                options={productsList}
                value={product}
                onChange={(e, inputState) => { getFunnelData(inputState.value); }}
              />
            </div>
          </Card.Header>
          <Grid className="funnel-grid">
            <Grid.Row divided textAlign="center" stretched>
              <Grid.Column width="4">
                <div className="funnel-label">
                  Total Groups
                </div>
                <canvas ref={(c) => { this.totalShape = c; }} height={206} />
                <div className="funnel-info">
                  <Link className="groups" to="/clients" onClick={() => { setFilters(); }}>{funnelData[TOTAL] && Object.keys(funnelData[TOTAL])[0]} Groups</Link>
                  <p>{funnelData[TOTAL] && Object.values(funnelData[TOTAL])[0]} Employees</p>
                </div>
              </Grid.Column>
              <Grid.Column width="4">
                <div className="funnel-label">
                  Quoted
                </div>
                <canvas className="funnel-padding" ref={(c) => { this.quotedShape = c; }} height={206} />
                <div className="funnel-info">
                  <Link className="groups" to="/clients" onClick={() => { setFilters({ clientStates: [QUOTED] }); }}>{funnelData[QUOTED] && Object.keys(funnelData[QUOTED])[0]} Groups</Link>
                  <p>{funnelData[QUOTED] && Object.values(funnelData[QUOTED])[0]} Employees</p>
                </div>
              </Grid.Column>
              <Grid.Column width="4">
                <div className="funnel-label">
                  Competitive
                  <p className="sub-text">(Below Current)</p>
                </div>
                <canvas className="funnel-padding" ref={(c) => { this.competitiveShape = c; }} height={206} />
                <div className="funnel-info">
                  <Link className="groups" to="/clients" onClick={() => { setFilters({ difference: [-Infinity, 0] }); }}>{funnelData[COMPETITIVE] && Object.keys(funnelData[COMPETITIVE])[0]} Groups</Link>
                  <p>{funnelData[COMPETITIVE] && Object.values(funnelData[COMPETITIVE])[0]} Employees</p>
                </div>
              </Grid.Column>
              <Grid.Column width="4">
                <div className="funnel-label">
                  Sold
                </div>
                <canvas className="funnel-padding" ref={(c) => { this.soldShape = c; }} height={206} />
                <div className="funnel-info">
                  <Link className="groups" to="/clients" onClick={() => { setFilters({ clientStates: [SOLD] }); }}>{funnelData[SOLD] && Object.keys(funnelData[SOLD])[0]} Groups</Link>
                  <p>{funnelData[SOLD] && Object.values(funnelData[SOLD])[0]} Employees</p>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    );
  }
}

export default FunnelCard;
