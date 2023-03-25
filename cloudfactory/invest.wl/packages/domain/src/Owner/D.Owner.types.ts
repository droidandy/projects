export const DOwnerAdapterTid = Symbol.for('DOwnerAdapterTid');

export interface IDOwnerAdapter {
  address: string;
  phone: string;
  phoneCallCenter: string;
  emailCustomer: string;
  emailHelp: string;
  emailTechnical: string;
}

export const DOwnerStoreTid = Symbol.for('DOwnerStoreTid');
