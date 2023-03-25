import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import ItemValueTyped from '../ItemValueTyped';

class RXBody extends React.Component {
  static propTypes = {
    plan: PropTypes.object.isRequired,
    rxClassName: PropTypes.string.isRequired,
    rxColumnClassName: PropTypes.string.isRequired,
    rxRowType: PropTypes.string.isRequired,
  };

  render() {
    const {
      plan,
      rxClassName,
      rxColumnClassName,
      rxRowType,
    } = this.props;
    const rxInner = (item, key) => {
      if (item.valueIn || item.valueOut) {
        return (
          <Grid columns={2} className="rx-row-body" key={key}>
            <Grid.Row>
              <Grid.Column className="two-cols rx content-col">
                <ItemValueTyped
                  item={item}
                  benefits="in"
                />
              </Grid.Column>
              <Grid.Column className="two-cols rx content-col white">
                <ItemValueTyped
                  item={item}
                  benefits="out"
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        );
      }
      return (
        <Grid columns={1} className="rx-row-body" key={key}>
          <Grid.Row>
            <Grid.Column className={rxColumnClassName}>
              <ItemValueTyped item={item} benefits="" />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    };
    return (
      <Grid.Column className={`rx-body ${rxClassName}`}>
        {plan && plan.rx.length && plan.rx.map((item, j) => {
          if (rxRowType === 'name') {
            return (
              <Grid columns={1} key={j} className="one-col rx">
                <span>{item.name}</span>
              </Grid>
            );
          }
          return (
            rxInner(item, j)
          );
        })
        }
      </Grid.Column>
    );
  }
}

export default RXBody;
