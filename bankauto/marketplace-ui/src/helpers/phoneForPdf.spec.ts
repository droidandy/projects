import { phoneForPdf } from './phoneForPdf';

describe('Pdf', () => {
  it('should return valid phone number', () => {
    const phoneNumber = phoneForPdf('79004838555');
    expect(phoneNumber).toEqual('+7 900 483 85 55');
  });
});
