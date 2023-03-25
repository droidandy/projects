import { useNavigation } from './navigation';
import { AppLink } from '../apollo/requests';
import { ROUTES } from '../configs/routeName';
import { useSearch } from '../contexts/common-data-provider';
import { NavigationContext, NavigationRoute, NavigationScreenProp } from 'react-navigation';

// export const useAppLink = () => {
//   const { navigate } = useNavigation();
//   const { setSearch } = useSearch();
//
//   return (link?: AppLink | null) => {
//     console.log('link', link);
//     if (!link) return;
//     switch (link.screen) {
//       case 'search':
//         setSearch(link.data);
//         navigate(ROUTES.search);
//         break;
//       case 'promoAction':
//         navigate(ROUTES.promoAction, { id: +link.data, title: link.navTitle });
//         break;
//       case 'product':
//         navigate(ROUTES.product, { id: +link.data, title: link.navTitle });
//         break;
//     }
//   };
// };

//
// type T = typeof NavigationContext
// const createAppLinkFunc = (navigate: NavigationScreenProp<NavigationRoute, Params>)
