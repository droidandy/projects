export function calculateInsurance(amount: number, term: number) {
  let ratio = 0.0012;
  if (amount <= 300_000) {
    ratio = 0.003;
  }
  if (amount > 300_000 && amount <= 600_000) {
    ratio = 0.002;
  }

  return (amount * 1.1 * ratio * term) / (1 - 1.1 * ratio * term);
}
