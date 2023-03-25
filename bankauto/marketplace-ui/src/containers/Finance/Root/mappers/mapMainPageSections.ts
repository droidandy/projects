import { MainPageSectionDTO, MainPageSection } from '../types/MainPageSection';

export const mapMainPageSections = (dtoSections: MainPageSectionDTO[]): MainPageSection[] =>
  dtoSections
    .map((section) => ({
      id: section.id,
      mainText: section.main_text,
      additionalText: section.additional_text,
      link: section.link,
      svgIcon: section.svg_icon,
    }))
    .sort((a, b) => a.id - b.id);
