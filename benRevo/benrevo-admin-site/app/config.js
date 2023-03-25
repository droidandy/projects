export const BENREVO_API_PATH = process.env.BENREVO_API_PATH || 'http://localhost:3001/mockapi/v1';
export const CARRIER = process.env.CARRIER || 'ANTHEM';

export const selectedCarrier = {
  carrier: null,
  set value(value) {
    this.carrier = value;
  },
  get value() {
    return this.carrier;
  },
};
