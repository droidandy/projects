import Cookies from 'js-cookie';

export const httpOptions = {
  withCredentials: true,
  headers: {
    'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'),
  },
};

export const getIdFromLocation = () => {
  return Number(window.location.pathname.split('/')[2]);
};
