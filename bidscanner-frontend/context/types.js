// @flow
export type Currency = 'USD' | 'EUR';
export type Rating = 0 | 1 | 2 | 3 | 4 | 5;
export type Status = 'Shiped' | 'Negotiaion' | 'Funds in Escrow' | 'Purchase Order' | 'Paid' | 'Disputed';
// TODO: union of string (countries)
export type Country = string;
export type GeneralFilter = 'Suppliers' | 'Products' | 'Requests';
export type Entity = 'Suppliers' | 'Products' | 'Requests';
