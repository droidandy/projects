import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header } from 'semantic-ui-react';

class ReviewNotes extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    text: PropTypes.string,
    category: PropTypes.string.isRequired,
  };


  render() {
    const { text, category } = this.props;
    return (
      <Grid.Column width={16}>
        <Grid className="review-item">
          <Grid.Row>
            <Grid.Column width={16} className="header-main">
              <Header as="h2">{category} Notes</Header>
              <div className="divider" />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="review-item-row">
            <Grid.Column width={16}>
              <span>{text}</span>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
    );
  }
}

export default ReviewNotes;
