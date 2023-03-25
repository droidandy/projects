// @flow
import { compose } from 'react-apollo';
import withData from 'lib/withData';
// import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import TransactionContainer from 'containers/transaction/TransactionContainer';

const data = {
  username: 'Derill Sanders',
  rating: 90,
  company: 'Industrial Supplies',
  country: 'China',
  userId: 1,
  messages: [
    {
      id: 1,
      sender: {
        id: 2,
        imgSrc: 'https://placeimg.com/34/34/people',
      },
      reciever: {
        id: 1,
        imgSrc: 'https://placeimg.com/34/34/tech',
      },
      message:
        "Hi, Marc. I'm Derill from industrail Supplies. We saw your RFQ and we have 10 tonns of API 5L that we can ship in two weeks. Please let me know if you are interested",
      date: new Date(),
      files: [
        {
          name: 'detail specs.xls',
        },
        {
          name: 'detail specs.xls',
        },
        {
          name: 'detail specs.xls',
        },
      ],
    },
    {
      id: 2,
      sender: {
        id: 2,
        imgSrc: 'https://placeimg.com/34/34/people',
      },
      reciever: {
        id: 1,
        imgSrc: 'https://placeimg.com/34/34/tech',
      },
      message:
        "Hi, Marc. I'm Derill from industrail Supplies. We saw your RFQ and we have 10 tonns of API 5L that we can ship in two weeks. Please let me know if you are interested",
      date: new Date(),
    },
    {
      id: 3,
      sender: {
        id: 1,
        imgSrc: 'https://placeimg.com/34/34/tech',
      },
      reciever: {
        id: 2,
        imgSrc: 'https://placeimg.com/34/34/people',
      },
      message: 'Hi, Derill. We appreciate your message, but we only need 2 tonns as described in RFQ.',
      date: new Date(),
    },
    {
      id: 4,
      sender: {
        id: 2,
        imgSrc: 'https://placeimg.com/34/34/people',
      },
      reciever: {
        id: 1,
        imgSrc: 'https://placeimg.com/34/34/tech',
      },
      message: 'We can arrange a discount if you order 5.',
      date: new Date(),
    },
    {
      id: 5,
      sender: {
        id: 1,
        imgSrc: 'https://placeimg.com/34/34/tech',
      },
      reciever: {
        id: 2,
        imgSrc: 'https://placeimg.com/34/34/people',
      },
      message: 'Please send offer.',
      date: new Date(),
    },
    {
      id: 6,
      sender: {
        id: 2,
        imgSrc: 'https://placeimg.com/34/34/people',
      },
      reciever: {
        id: 1,
        imgSrc: 'https://placeimg.com/34/34/tech',
      },
      date: new Date(),
      files: [
        {
          name: 'detail specs.xls',
        },
        {
          name: 'detail specs.xls',
        },
        {
          name: 'detail specs.xls',
        },
      ],
    },
    {
      id: 7,
      sender: {
        id: 1,
        imgSrc: 'https://placeimg.com/34/34/tech',
      },
      reciever: {
        id: 2,
        imgSrc: 'https://placeimg.com/34/34/people',
      },
      message: 'Please send photos.',
      date: new Date(),
    },
  ],
};

const TransactionPage = props => <TransactionContainer {...props} {...data} />;

export default compose(withData)(TransactionPage);
