export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = token => localStorage.setItem('token', token);
export const removeAuthToken = token => localStorage.removeItem('token');
