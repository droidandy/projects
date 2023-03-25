// @flow
import React from 'react';
import ServicesLayout from 'components/services-layout/ServicesLayout';
import Container from 'components/styled/Container';
import { Flex } from 'grid-styled';
import styled from 'styled-components';
import Description from 'components/product-showcase/ProductShowcase/Description';
import HowItWorks from 'components/product-showcase/ProductShowcase/HowItWorks';
import Promotion from 'components/product-showcase/ProductShowcase/Promotion';

const faqs = [
  {
    title: 'What is product posting',
    text:
      'With this service, you can publish your products on tradekoo.com and have them listed on our search pages as buyers type matching keywords while searching for specific supplies. Besides that, your products get indexed by Google / Bing and published on our Linkedin and Facebook high traffic pages. Interested buyers are able to comment, like and share your products on their socials networks. This is a great service to increase the visibility of your products, and their sale, across the web at no cost. To boost the visibility of some of your key products, placing them at the top of our search results for matching keywords, you can pick a paid promotion.',
  },
  {
    title: 'Can I increase my sales by posting products?',
    text:
      'Definitely yes. Our marketplace is global, open 24/7 and consulted daily by thousands of buyers. By publishing your products, you increase your chances of receiving sales inquiries from international buyers, communicate with them and close profitable sales. Our escrow service, then, helps you sell to new customers safely, eliminating payment risks (read more-->hyperlink to escrow page).',
  },
  {
    title: 'How many products can I post?',
    text:
      'You can post unlimited free products on tradekoo.com. Your posts shall be professional, complete and enriched by good pictures to be approved by our team and published on the marketplace (we moderate all postings to ensure quality). In case you need to promote some of your products, you can pick a paid promotion (we show paid posts at the top of search results for given keywords).',
  },
  {
    title: 'How can buyers find my products?',
    text:
      'As you post your products, and we approve them, they get stored in our products database. Buyers can find them by typing matching keywords on our search page (as happens in Google and Bing) and send you their inquiries. Hence, it is very important that you use “keywords rich” titles and descriptions for your products at posting and that that you tag them properly (picking relevant product categories from our standardized nomenclature). Accurate postings increase your sale potential.',
  },
  {
    title: 'Can I promote my products?',
    text:
      'Yes, you can choose between free or paid posting. The main difference is that paid products are listed at the top of our search results for matching keywords, so they have better visibility, whereas free products are shown with a natural (organic) ranking. In any case, the visibility of your product on our search page depends on the keyword entered by the buyer (so: we show valve products, and not steel pipes, if buyer typed valve as keyword). Essentially, our search logic and post promotion is very close to Google’s and Bing’s.',
  },
  {
    title: 'How long does a promotion last?',
    text:
      'A paid product is shown at the top of our search page for one week. You can renew a promotion as many times as you like. If you do not renew the promotion, your product will still be found by buyers, but with a standard ranking. Promotions raise the visibility of your products for matching search keywords typed by users.',
  },
  {
    title: 'Do Google and Bing index my products?',
    text:
      'Yes, any product you post is indexed also by Google / Bing and so it can be found in the course od standard web searches. This is a great free feature to further increase the visibility of your products across the web. To maximise the impact of this powerful and unique feature of our portal, it is essential that you choose a “keyword rich” title for your product and that you pick proper tags from our products nomenclature at posting.',
  },
  {
    title: 'How can buyers contact me?',
    text:
      'Interested buyers can review your product and contact you online. You receive a message notificiation and can chat with them online. Any message is saved so you can see the history of your communications from your dashboard. We encourage you keep any dialogue with buyers online, to be able to “transform” a lead into an order to be managed with our escrow payment service (which includes the full online management of the order execution).',
  },
  {
    title: 'Where do my products appear after posting?',
    text:
      'We show your products on multiple spots, to increase their visibility across the board and help you boost your sales. First of all, they appear on our product search pages, when buyers type relevant keywords. Secondly, they are indexed by Google and Bing (so buyers can find them also in the course of a standard web search). Thirdly, we publish your paid products on our high traffic Linkedin and Facebook pages. Finally, we push your products as “suggested” to any potential buyer (based on profile, behaviour and past purchases).',
  },
  {
    title: 'How long does it take to post a product?',
    text:
      'It takes 5 minutes to publish one product properly (1 hour for 10/15 products). You can enter any required product detail with a super easy and fast interface, drag and drop pictures, review your post and publish it. To enhance the visibility of your products, use proper titles, descriptions, quality images and relevant tags.',
  },
  {
    title: 'Can I upload multiple products in one go?',
    text:
      'Please contact us in case you need to upload a massive list of products. We can automate part of the work with some offline preparation work.',
  },
  {
    title: 'Can I edit or delete my products?',
    text:
      'Yes. All your posted products are available from your dashabord and can be edited, promoted and deleted from there.',
  },
];

const Title = styled.span`
  font-size: 30px;
  font-weight: bold;
`;

const Subtitle = styled.span`text-align: center;`;

export default () => (
  <ServicesLayout
    active="product-showcase"
    faqs={faqs}
    description="Publish your producs for free, increase their visibility for international buyers, reply to customer inquiries and close sale deals."
    keywords="post products, show products, product catalog"
    title="Showcase your Products to Buyers"
  >
    <Container>
      <Flex justify="center">
        <Title>Showcase Your Products, Attract New Buyers</Title>
      </Flex>
      <Flex justify="center">
        <Flex w={3 / 4} mt={2}>
          <Subtitle>
            Publish you products for free and attract new buyers immediately. When posted products become
            visible on our high traffic search, Linkedin, Facebok, pages and get indexed by Google/Bing
          </Subtitle>
        </Flex>
      </Flex>
    </Container>
    <Description />
    <Container>
      <HowItWorks />
      <Promotion />
    </Container>
  </ServicesLayout>
);
