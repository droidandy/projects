import { CreditInsurance } from 'dtos/SimpleCreditDTO';

enum InsuranceID {
  SZ30 = 5,
  SZ20 = 2,
  SZ15 = 1,
  SZ12 = 0,
}

export function getCreditInsurances(amount: number, term: number): CreditInsurance[] {
  const insurance: CreditInsurance = {
    type: 1,
    company: 1,
    tariff: InsuranceID.SZ12,
    term,
    amount,
    index: 0,
  };
  if (amount <= 300_000) {
    insurance.tariff = InsuranceID.SZ30;
  }
  if (amount > 300_000 && amount <= 600_000) {
    insurance.tariff = InsuranceID.SZ20;
  }
  if (amount > 600_000 && amount <= 1_500_000) {
    insurance.tariff = InsuranceID.SZ15;
  }
  return [insurance];
}
