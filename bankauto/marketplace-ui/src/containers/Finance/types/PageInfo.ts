export interface PageInfoBenefitsDTO {
  id: number;
  name: string;
  page_configuration_id: number;
  main_text?: string;
  additional_text?: string;
  svg_icon: string;
  mobile_svg_icon: string;
  sorting_position: number;
}

export interface PageInfoBenefits {
  id: number;
  name: string;
  pageConfigurationId: number;
  mainText?: string;
  additionalText?: string;
  svgIcon: string;
  mobileSvgIcon: string;
}

export interface PageInfoDTO {
  id: number;
  alias: string;
  name: string;
  main_text: string;
  additional_text: string;
  button_text: string | null;
  button_color: string | null;
  button_link: string | null;
  benefits: PageInfoBenefitsDTO[];
  img_desktop: {
    '1920': string;
  };
  img_mobile: {
    '750': string;
  };
}

export interface PageInfo {
  id: number;
  alias: string;
  name: string;
  mainText: string;
  additionalText: string;
  buttonText: string;
  buttonColor: string;
  buttonLink: string;
  benefits: PageInfoBenefits[];
  imgDesktop: string;
  imgMobile: string;
}
