export const BENREVO_API_PATH = process.env.BENREVO_API_PATH || 'http://localhost:3333/mockapi/v1';
export const CARRIER = process.env.CARRIER || 'ANTHEM';
export const BENREVO_PATH = process.env.BENREVO_PATH || '/anthem/';
export const carriers = {
  UHC: 'uhc',
  ANTHEM: 'anthem',
};
export const carrierName = (CARRIER === 'ANTHEM') ? 'Anthem Blue Cross' : 'UnitedHealthcare';
