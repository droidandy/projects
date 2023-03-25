// @flow
import Layout from 'components/Layout';
import withData from 'lib/withData';
import { Container, Row, Col } from 'reactstrap';
import Heading from 'components/styled/Heading';

const Page404 = () =>
  <Layout title="404 | Not Found" verticalCenter contentOnly>
    <Container>
      <Row>
        <Col>
          <Heading bold>Not Found!</Heading>
        </Col>
      </Row>
    </Container>
  </Layout>;

export default withData(Page404);
