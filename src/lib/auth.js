export const getAuthToken = () => {
  return localStorage.getItem('axim_passport_token');
};

export const setAuthToken = (token) => {
  localStorage.setItem('axim_passport_token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('axim_passport_token');
};

export const getUserRole = () => {
  const user = localStorage.getItem('axim_passport_user');
  if (user) {
    try {
      return JSON.parse(user).role;
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const getUser = () => {
  const user = localStorage.getItem('axim_passport_user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const setUser = (user) => {
  localStorage.setItem('axim_passport_user', JSON.stringify(user));
};

export const clearUser = () => {
  localStorage.removeItem('axim_passport_user');
};

export const redirectToLogin = () => {
  window.location.href = `https://passport.axim.us.com/login?redirect=${encodeURIComponent(window.location.origin + '/auth/callback')}`;
};
