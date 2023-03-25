// @flow
import { compose } from 'react-apollo';
import withData from 'lib/withData';
import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import UserDealsContainer from 'containers/deals/DealsContainer';

const deals = [
  {
    id: 70468,
    image: '/static/100.png',
    name: 'Derill SAnders',
    company: 'pipingonline',
    reference: 'Unmatched toner catridge quality',
    date: new Date(2017, 11, 11),
    status: 'Shipped',
    read: false,
  },
  {
    id: 70469,
    image: '/static/100.png',
    name: 'Derill SAnders',
    company: 'pipingonline',
    reference: 'Unmatched toner catridge quality',
    date: new Date(2017, 11, 11),
    status: 'Negotiation',
    read: true,
  },
  {
    id: 70470,
    image: '/static/100.png',
    name: 'Derill SAnders',
    company: 'pipingonline',
    reference: 'Unmatched toner catridge quality',
    date: new Date(2017, 11, 11),
    status: 'Funds in Escrow',
    read: false,
  },
  {
    id: 70471,
    image: '/static/100.png',
    name: 'Derill SAnders',
    company: 'pipingonline',
    reference: 'Unmatched toner catridge quality',
    date: new Date(2017, 11, 11),
    status: 'Purchase Order',
    read: true,
  },
  {
    id: 70472,
    image: '/static/100.png',
    name: 'Derill SAnders',
    company: 'pipingonline',
    reference: 'Unmatched toner catridge quality',
    date: new Date(2017, 11, 11),
    status: 'Paid',
    read: false,
  },
  {
    id: 70473,
    image: '/static/100.png',
    name: 'Derill SAnders',
    company: 'pipingonline',
    reference: 'Unmatched toner catridge quality',
    date: new Date(2017, 11, 11),
    status: 'Disputed',
    read: false,
  },
];

const UserDeals = props => <UserDealsContainer deals={deals} {...props} />;

export default compose(withData, redirectIfNotLogged)(UserDeals);
