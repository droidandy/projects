const UrlPrettifier = require('next-url-prettifier').default;

const password = [
  {
    page: 'password/update',
    prettyUrl: '/public/accounts/set-new-password',
  },
  {
    page: 'password/create',
    prettyUrl: '/public/accounts/account-details',
  },
  {
    page: 'password/request',
    prettyUrl: '/public/accounts/login-email',
  },
];

const item = [
  {
    page: 'item/create',
    prettyUrl: '/private/products/create-product',
  },
  {
    page: 'item/details',
    prettyUrlPatterns: [
      { pattern: '/public/search/products-sale/:id' },
      { pattern: '/private/search/products-sale/:id' },
    ],
  },
  {
    page: 'item/details',
    prettyUrl: '/private/products/post-product',
  },
  {
    page: 'item/review',
    prettyUrl: '/private/products/post-product',
  },
];

const rfq = [
  {
    page: 'rfq/create',
    prettyUrl: '/private/rfqs/create-rfq',
  },
  {
    page: 'rfq/details',
    prettyUrlPatterns: [
      { pattern: '/public/search/buy-requests/:id' },
      { pattern: '/private/search/buy-requests/:id' },
    ],
  },
  {
    page: 'rfq/review',
    prettyUrl: '/private/rfqs/post-rfq',
  },
];

const system = [
  {
    page: 'system/404',
    prettyUrl: '/404',
  },
  {
    page: 'system/status',
    prettyUrl: '/status',
  },
];

const general = [
  // home
  {
    page: 'general/home',
    prettyUrl: '/index',
  },
  {
    page: 'general/home',
    prettyUrl: '/',
  },
  // search
  {
    page: 'general/search',
    prettyUrlPatterns: [
      { pattern: '/public/search/products-sale', defaultParams: { publ: 'public', entity: 'Products' } },
      { pattern: '/public/search/buy-requests', defaultParams: { publ: 'public', entity: 'Requests' } },
      { pattern: '/public/search/suppliers', defaultParams: { publ: 'public', entity: 'Suppliers' } },
      { pattern: '/private/search/products-sale', defaultParams: { publ: 'private', entity: 'Products' } },
      { pattern: '/private/search/buy-requests', defaultParams: { publ: 'private', entity: 'Requests' } },
      { pattern: '/private/search/suppliers', defaultParams: { publ: 'private', entity: 'Suppliers' } },
    ],
  },
  {
    page: 'general/termsofuse',
    prettyUrl: '/public/terms-conditions',
  },
  {
    page: 'general/about',
    prettyUrl: '/public/about-tradekoo-marketplace',
  },
];

const landing = [
  {
    page: 'landing/index',
    prettyUrl: '/public/landing',
  },
  {
    page: 'landing/products',
    prettyUrl: '/public/sell-products',
  }
]

const user = [
  {
    page: 'user/account',
    prettyUrl: '/private/account/profile',
  },
  {
    page: 'user/deals',
    prettyUrl: '/private/transactions',
  },
  {
    page: 'user/timeline',
    prettyUrl: '/private/timeline',
  },
  {
    page: 'user/transaction',
    prettyUrl: '/private/transactions/create-order',
  },
  {
    page: 'user/products',
    prettyUrl: '/private/products/posted-products',
  },
  {
    page: 'user/rfqs',
    prettyUrl: '/private/rfqs/posted-rfqs',
  },
  {
    page: 'user/liked/rfqs',
    prettyUrl: '/private/rfqs/liked-rfqs',
  },
  {
    page: 'user/liked/products',
    prettyUrl: '/private/products/liked-products',
  },
  {
    page: 'user/suggested/rfqs',
    prettyUrl: '/private/rfqs/matching-rfqs',
  },
  {
    page: 'user/suggested/products',
    prettyUrl: '/private/products/matching-products',
  },
  {
    page: 'user/bills',
    prettyUrl: '/private/account/bills',
  },
  {
    page: 'user/network',
    prettyUrl: '/private/account/network',
  },
  {
    page: 'user/company/users',
    prettyUrl: '/private/account/profile/company/users',
  },
  {
    page: 'user/company',
    prettyUrl: '/private/account/profile/company',
  },
  {
    page: 'user/transaction',
    prettyUrl: '/private/transactions/create-order',
  },
];

const details = [
  {
    page: 'details/company',
    prettyUrlPatterns: [
      { pattern: '/public/search/suppliers/:userID/:companyID/:company/:user' },
      { pattern: '/private/search/suppliers/:userID/:companyID/:company/:user' },
    ],
  },
  {
    page: 'details/supplier',
    prettyUrlPatterns: [
      { pattern: '/public/search/suppliers/:userID/:company/:user' },
      { pattern: '/private/search/suppliers/:userID/:company/:user' },
    ],
  },
];

const routes = [...password, ...rfq, ...item, ...system, ...general, ...landing, ...user, ...details];

const urlPrettifier = new UrlPrettifier(routes);

exports.default = routes;
exports.Router = urlPrettifier;
