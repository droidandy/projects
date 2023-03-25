import API from '../../request';

/**
 * acquiring: "2"
 amount: 499
 created_at: 1637849846
 currency: "643"
 external_id: "b9da4fd5-fb3f-7390-8f14-de8300a25a80"
 fail_url: "http://marketplace-ui-latest.marketplace.dev.bankauto.lo/profile/applications"
 hold_url: "https://web.rbsuat.com/rgsb/merchants/rgs/payment_ru.html?mdOrder=b9da4fd5-fb3f-7390-8f14-de8300a25a80"
 id: 164
 return_url: "http://marketplace-ui-latest.marketplace.dev.bankauto.lo/profile/applications/84bd4904-b320-4d91-a2cb-c6428094ebcf"
 signature: null
 status: 1
 updated_at: 1637849846
 */
type PayForOrderResponse = {
  hold_url: 'string';
  id: number;
};

export const payForOrder = (applicationId: number): Promise<PayForOrderResponse> => {
  return API.post<PayForOrderResponse>(
    `/application/booking/vehicle/${applicationId}`,
    {},
    {
      authRequired: true,
    },
  ).then(({ data }) => data);
};
