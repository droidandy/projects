import { ReactComponent as FbIcon } from '@marketplace/ui-kit/icons/icon-social-fb';
import { ReactComponent as VkIcon } from '@marketplace/ui-kit/icons/icon-social-vk';
import { ReactComponent as OkIcon } from '@marketplace/ui-kit/icons/icon-social-odnoklassniki';
import { ReactComponent as IgIcon } from '@marketplace/ui-kit/icons/icon-social-instagram';
import { ReactComponent as YoutubeIcon } from '@marketplace/ui-kit/icons/icon-social-youtube';
import { ReactComponent as TiktokIcon } from '@marketplace/ui-kit/icons/icon-social-tiktok';
import { socialNetworks } from '@marketplace/ui-kit/constants';

const { fbUrl, vkUrl, okRuUrl, instagramUrl, youtubeUrl, tiktokUrl } = socialNetworks;

export const SOCIAL_ICONS = [
  { icon: FbIcon, href: fbUrl },
  { icon: VkIcon, href: vkUrl },
  { icon: OkIcon, href: okRuUrl },
  { icon: IgIcon, href: instagramUrl },
  { icon: YoutubeIcon, href: youtubeUrl },
  { icon: TiktokIcon, href: tiktokUrl },
];

export const CONNECTION = [
  {
    href: 'tel:+78007004040',
    title: 'Телефон поддержки',
    value: '8 800 700-40-40',
  },
  {
    href: 'mailto:consult@rgsbank.ru',
    title: 'Онлайн поддержка',
    value: 'consult@rgsbank.ru',
  },
];

const getCurrentYear = new Date().getFullYear();

export const COPYRIGHT = [`© 2012 - ${getCurrentYear}, ПАО «РГС Банк»`, 'Лицензия ЦБ РФ 3073.'];
