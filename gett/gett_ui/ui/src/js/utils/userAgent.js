const userAgent = window.navigator.userAgent;

export const isSafariMobile = userAgent.match(/iP(ad|hone)/i) &&
  userAgent.match(/AppleWebKit/) &&
  !userAgent.match(/CriOS/i);

export const isMobile = (userAgent.match(/Android/i) ||
  userAgent.match(/iP(ad|od|hone)/i) ||
  userAgent.match(/webOS/i) ||
  userAgent.match(/BlackBerry/i) ||
  userAgent.match(/Windows Phone/i));
