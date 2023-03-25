import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Accordion } from 'semantic-ui-react';

class VerticalDivider extends React.Component {
  static propTypes = {
    activeIndex: PropTypes.array.isRequired,
    accordionClick: PropTypes.func.isRequired,
  };

  render() {
    const { activeIndex, accordionClick } = this.props;
    return (
      <div className="vertical-divider">
        <Accordion className="benefits-line">
          <Accordion.Title active={activeIndex[0]} onClick={() => accordionClick()}>
            <Grid>
              <Grid.Column />
            </Grid>
          </Accordion.Title>
          <Accordion.Content className="cost" active={activeIndex[0]}>
            <Grid>
              <Grid.Column />
            </Grid>
          </Accordion.Content>
          <Accordion.Content className="benefit" active={activeIndex[1]}>
            <Grid>
              <Grid.Column />
            </Grid>
          </Accordion.Content>
          <Accordion.Content className="rx" active={activeIndex[2]}>
            <Grid>
              <Grid.Column />
            </Grid>
          </Accordion.Content>
        </Accordion>
      </div>
    );
  }
}

export default VerticalDivider;
