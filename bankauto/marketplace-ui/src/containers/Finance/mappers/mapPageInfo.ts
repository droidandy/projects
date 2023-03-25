import { PageInfoBenefitsDTO, PageInfoBenefits, PageInfoDTO, PageInfo } from '../types/PageInfo';

export const mapBenefits = (dtoBenefits: PageInfoBenefitsDTO[]): PageInfoBenefits[] =>
  dtoBenefits
    .sort((a, b) => a.sorting_position - b.sorting_position)
    .map((benefit) => ({
      id: benefit.id,
      name: benefit.name,
      pageConfigurationId: benefit.page_configuration_id,
      mainText: benefit.main_text,
      additionalText: benefit.additional_text,
      svgIcon: benefit.svg_icon,
      mobileSvgIcon: benefit.mobile_svg_icon,
    }));

export const mapPageInfo = (dtoPageInfo: PageInfoDTO[]): PageInfo[] =>
  dtoPageInfo.map((pageInfo) => ({
    id: pageInfo.id,
    alias: pageInfo.alias,
    name: pageInfo.name,
    mainText: pageInfo.main_text,
    additionalText: pageInfo.additional_text,
    buttonText: pageInfo.button_text || '',
    buttonColor: pageInfo.button_color || 'primary',
    buttonLink: pageInfo.button_link || '',
    benefits: mapBenefits(pageInfo.benefits),
    imgDesktop: pageInfo.img_desktop['1920'],
    imgMobile: pageInfo.img_mobile['750'],
  }));
