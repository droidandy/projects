import { post } from 'utils';

export * from 'pages/app/bookers/components/utils';

export function calculateExcessDistance(homeAddress, workAddress) {
  // this request is only available in `app` realm;
  return post('/passengers/calculate_excess', { homeAddress, workAddress })
    .then(res => res.data);
}
