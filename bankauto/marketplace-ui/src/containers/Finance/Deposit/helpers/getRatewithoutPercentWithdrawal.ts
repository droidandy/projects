/**
 * % эф =100*((1 + P / 100 / 12)N — 1) * 12 / N
 * где N – срок вклада в месяцах
 * P – годовая процентная ставка(с учетом надбавок, срока и т.д.) в процентах(т.е. 12 %, например, а не 0.12)
 */
const getRatewithoutPercentWithdrawal = (depositRate: number, term: number): number =>
  100 * ((1 + depositRate / 100 / 12) ** term - 1) * (12 / term);

export { getRatewithoutPercentWithdrawal };
