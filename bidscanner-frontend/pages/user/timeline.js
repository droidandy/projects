// @flow
import { compose } from 'react-apollo';
import withData from 'lib/withData';
// import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import Layout from 'components/Layout';

import Container from 'components/styled/Container';

import MyTimeline from 'components/timeline/Timeline';

const eventsByDateMock = [
  {
    date: new Date(),
    events: [
      { id: '1', text: 'Someone did something' },
      { id: '2', text: 'Someone did something' },
      { id: '3', text: 'Someone did something' },
      { id: '4', text: 'Someone did something' },
    ],
  },
  {
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    events: [
      { id: '5', text: 'Someone did something' },
      { id: '6', text: 'Someone did something' },
      { id: '7', text: 'Someone did something' },
      { id: '8', text: 'Someone did something' },
      { id: '9', text: 'Someone did something' },
      { id: '10', text: 'Someone did something' },
    ],
  },
  {
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    events: [
      { id: '5', text: 'Someone did something' },
      { id: '6', text: 'Someone did something' },
      { id: '7', text: 'Someone did something' },
    ],
  },
];

const recommendedUsers = [
  {
    id: '1',
    name: 'Ross Geller',
    company: 'Friends TVS',
    country: 'USA',
  },
  {
    id: '2',
    name: 'Chandler Bing',
    company: 'Friends TVS',
    country: 'USA',
  },
  {
    id: '3',
    name: 'Joey Tribbiani',
    company: 'Friends TVS',
    country: 'USA',
  },
];

const recommendedRFQs = [
  {
    id: '1',
    title: 'Super Mega Giga Pipes',
    username: 'Chandler Bing',
  },
  {
    id: '2',
    title: 'Super Mega Giga Pipes',
    username: 'Chandler Bing',
  },
  {
    id: '3',
    title: 'Super Mega Giga Pipes',
    username: 'Chandler Bing',
  },
];

const TimelinePage = () => (
  <Layout title="My Timeline">
    <Container>
      <MyTimeline
        eventsByDate={eventsByDateMock}
        recommendedUsers={recommendedUsers}
        recommendedRFQs={recommendedRFQs}
      />
    </Container>
  </Layout>
);

export default compose(withData /* , redirectIfNotLogged */)(TimelinePage);
