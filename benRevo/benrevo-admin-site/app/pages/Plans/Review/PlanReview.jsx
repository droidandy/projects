import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Button } from 'semantic-ui-react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import ReviewItem from './components/ReviewItem';
import ReviewNotes from './components/ReviewNotes';

class Review extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    summaries: PropTypes.object.isRequired,
    currentBroker: PropTypes.object.isRequired,
    selectedClient: PropTypes.object.isRequired,
    medicalPlans: PropTypes.array.isRequired,
    dentalPlans: PropTypes.array.isRequired,
    visionPlans: PropTypes.array.isRequired,
  };

  render() {
    const { currentBroker, selectedClient, medicalPlans, dentalPlans, visionPlans, summaries } = this.props;

    return (
      <div>
        <Grid stackable container className="plans-review section-wrap">
          <Grid.Row>
            <Grid.Column width={16}>
              <Helmet
                title="Review"
                meta={[
                { name: 'description', content: 'Description of Review' },
                ]}
              />
              <Button as={Link} to="/client/plans/quote" primary size="medium" className="back">Back to Summary</Button>
              <Grid stackable as={Segment} className="gridSegment">

                <Grid.Row className="header-second">
                  <Header as="h1">{currentBroker.name} - {selectedClient.clientName}</Header>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <ReviewItem data={medicalPlans} category="medical" />
                    <ReviewNotes text={summaries.medical} category="medical" />
                    <ReviewNotes text={summaries.kaiser} category="kaiser" />
                    <ReviewItem data={dentalPlans} category="dental" />
                    <ReviewNotes text={summaries.dental} category="dental" />
                    <ReviewItem data={visionPlans} category="vision" />
                    <ReviewNotes text={summaries.vision} category="vision" />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Button as={Link} to="/client/plans/quote" primary size="medium" className="back">Back to Summary</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Review;
