import Config from 'react-native-config';

// eslint-disable-next-line import/prefer-default-export
export const getReceiptUrl = orderId => `${Config.BASE_URL}/documents/receipt.pdf?booking_id=${orderId}`;
