// @flow
import React from 'react';
import styled from 'styled-components';

import { Flex, Box } from 'grid-styled';
import GoogleMapReact from 'google-map-react';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import Form from './Form';

const Heading = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 1.25rem;
`;

const MapContainer = styled.div`
  height: 333px;
  margin-bottom: 32px;
`;

const Paragraph = styled.p`line-height: 1.2rem;`;

export default () => (
  <Layout
    title="The First Social B2B Marketplace"
    description="Start buying and selling online with the most modern B2B portal for western buyers and sellers. We are in Switzerland and have international trading experience"
    keywords="tradekoo, marketplace, international trading"
    showSearch
  >
    <Container>
      <Flex mt={4} direction={['column', 'column', 'row']}>
        <Box order={[2, 2, 1]} w={[1, 1, 1 / 2]}>
          <MapContainer>
            <GoogleMapReact defaultCenter={[46.0294037, 8.9216258]} defaultZoom={12} />
          </MapContainer>
          <Form />
        </Box>
        <Box order={[1, 1, 2]} w={[1, 1, 1 / 2]} ml={[0, 0, 3]}>
          <Heading>About Us</Heading>
          <Paragraph>
            The world has become so fast paced that people don’t want to stand by reading a page of
            information, they would much rather look at a presentation and understand the message. It has come
            to a point where images and videos are used more to promote a product or service and this has
            extended from businesses to our daily routine. We are all in such a hurry that we wave bye instead
            of saying “goodbye”, show the watch to point to the time and so on. It is a healthy habit
            considering how we use our hands and motions to indicate what we are upto or capable of. Imagine
            dancing a few steps to tell someone you are off to a dance class? That would impress them to no
            end. The same applies when you are interacting with others online through a forum. You can take
            the assistance of MySpace Layouts to dress up your pages and convey messages to people who come
            by. These MySpace Layouts will have boxes for content, and for your personal information. There
            will also be provisions given in the MySpace Layouts for putting up pictures and videos. One might
            even be able to use the MySpace Layouts to put in a slideshow of their favorite pictures.
          </Paragraph>
          <Paragraph>
            As long as the page does not look too cluttered or it becomes difficult for people to read the
            text, these extra frills from MySpace Layouts can remain. However, if by using these from the
            MySpace Layouts, you are aiming at cutting across as professional, you might not really succeed.
            Because when our pages are filled with text, pictures and other fun elements, it loses its
            professionalism and becomes a fun page. So, it is advisable for you to choose from the MySpace
            Layouts sensibly. It might help make friends, but will it help you in your professional endeavors
            by using those MySpace Layouts? The MySpace Layouts site offers more than just backgrounds and
            most of us who have been there know this fact. There are surveys that we can create on MySpace
            Layouts page that will help us find out about others, or reveal more about ourselves. Apart from
            this, the MySpace Layouts website will contain MySpace music backgrounds, which will have musical
            notes or instruments as the background picture. These MySpace Layouts work well for a musician or
            an aspiring singer. Similarly, if a person loves animals, they can put in one of the many MySpace
            Layouts available on the site. Or they could upload a picture of their pet and using MySpace
            Layouts generator; create their own personalized one of a kind background. Whatever you decide to
            do with the MySpace Layouts, make sure to have put some thought into it if you are hoping to see
            some kind of visible improvement in your career or job front, welcoming new opportunities.
          </Paragraph>
        </Box>
      </Flex>
    </Container>
  </Layout>
);
