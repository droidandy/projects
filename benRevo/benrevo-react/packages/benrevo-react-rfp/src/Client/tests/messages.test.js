import { defineMessages } from 'react-intl';
import messages from '../messages';

describe('EmployerAppReducer', () => {
  const expextedMessages = defineMessages({
    rfpClient: {
      id: 'boilerplate.components.SubRFPMenuTitle.rfpClient',
      defaultMessage: 'Client',
    },
  });
  it('Client messsages', () => {
    expect(messages).toEqual(expextedMessages);
  });
});
