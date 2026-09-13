import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAuthToken, setUser } from '../../lib/auth';
import { useVoiceStore } from '../../store/useVoiceStore';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setCurrentUser = useVoiceStore((state) => state.setCurrentUser);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    if (token) {
      setAuthToken(token);

      // Validate token against Passport
      fetch('https://passport.axim.us.com/api/v1/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token })
      })
      .then(res => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then(data => {
        const user = data.user || {
          name: 'Operator Beta',
          role: 'admin',
          extension: 'EXT-402',
        };
        setUser(user);
        setCurrentUser(user);
        window.history.replaceState({}, document.title, '/');
        navigate('/', { replace: true });
      })
      .catch(err => {
        console.error('Passport SSO verification failed:', err);
        // Fallback or reject
        window.history.replaceState({}, document.title, '/');
        navigate('/', { replace: true });
      });

    } else {
      navigate('/', { replace: true });
    }
  }, [location, navigate, setCurrentUser]);

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-950">
      <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );
};
