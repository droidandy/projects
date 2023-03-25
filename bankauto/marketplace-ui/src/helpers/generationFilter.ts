import { BodyType } from '@marketplace/ui-kit/types';

export interface GenerationFilter {
  productionYear?: number;
  bodyTypeId?: number;
}

export const generationFilter = (
  generations: {
    id: number;
    name: string;
    status: string;
    bodyTypeId: number;
    bodyType: BodyType;
    yearStart: number;
    yearEnd?: number;
  }[],
  { bodyTypeId, productionYear }: GenerationFilter,
) => {
  return [...generations].filter(
    (g) =>
      (!bodyTypeId || g.bodyTypeId === bodyTypeId) &&
      (!productionYear || (g.yearStart <= productionYear && (!g.yearEnd || g.yearEnd >= productionYear))),
  );
};
