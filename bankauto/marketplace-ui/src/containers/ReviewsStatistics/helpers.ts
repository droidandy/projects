import { ReviewStatisticListItemType } from './components/ReviewStatisticListItem';

const getPercent = (summ: number, count: number) => (count ? (count / summ) * 100 : 0);

export const getReviewsMap = (data: Record<string, number>): ReviewStatisticListItemType[] => {
  const dataArray = Object.entries(data).reverse();
  const totalCount = dataArray.reduce((summ, [_, itemCount]) => summ + itemCount, 0);
  return dataArray.map(([starsCount, value]) => ({
    starsCount: +starsCount,
    rewiewsCount: value,
    percent: `${getPercent(totalCount, value)}%`,
  }));
};
