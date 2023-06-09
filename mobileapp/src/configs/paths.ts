/* Неавторизованные роуты */
export const initializePath = 'initialize';
export const authPath = 'auth';
export const loginPath = `${authPath}/login`;
export const registerPath = `${authPath}/register`;
export const forgotPasswordPath = `${authPath}/forgotPassword`;
/* Авторизованные роуты */
export const mainPath = 'main';
export const profilePath = 'profile';
export const mainProfilePath = `${profilePath}/main`;
export const profileSettingsPersonalPath = `${profilePath}/settings-personal`;
export const profileSettingsNotificationsPath = `${profilePath}/settings-notifications`;
export const searchPath = 'search/:query';
export const catalogPath = 'catalog';
export const mainCatalogPath = `${catalogPath}/main`;
export const childrenCatalogPath = `${catalogPath}/child/:childCategoryId`;
export const productsCatalogPath = `${catalogPath}/products/:productsCategoryId`;
export const pharmacyPath = 'pharmacy';
export const favouritesPath = 'favourites';
export const menuPath = 'menu';
export const productPath = 'product/:id';
export const orderListPath = 'orders';
export const orderPath = 'orders';
export const cartStepOnePath = 'cartStepOne';
export const cartStepTwoPath = 'cartStepTwo';
export const locationChangePath = 'location-change';
export const logoutPath = 'logout';
export const promoActionPath = 'promoAction';
export const promoActionsPath = 'promoActions';
