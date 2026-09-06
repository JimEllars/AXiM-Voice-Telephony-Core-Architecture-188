export const getAuthToken = () => {
  // First check localStorage for backwards compatibility, then check axim_session cookie
  let token = localStorage.getItem('axim_passport_token');
  if (token) return token;

  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('axim_session=')) {
      return cookie.substring('axim_session='.length, cookie.length);
    }
  }
  return null;
};

export const setAuthToken = (token) => {
  localStorage.setItem('axim_passport_token', token);
  // Also set cookie on the wild-card domain if possible
  const domain = window.location.hostname.includes('.axim.us.com') ? '.axim.us.com' : window.location.hostname;
  document.cookie = `axim_session=${token}; domain=${domain}; path=/; max-age=86400; secure; samesite=lax`;
};

export const clearAuthToken = () => {
  localStorage.removeItem('axim_passport_token');
  const domain = window.location.hostname.includes('.axim.us.com') ? '.axim.us.com' : window.location.hostname;
  document.cookie = `axim_session=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
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
