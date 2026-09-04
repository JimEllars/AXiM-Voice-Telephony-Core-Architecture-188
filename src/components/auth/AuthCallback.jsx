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

      // Simulate validating token and getting user
      const user = {
        name: 'Operator Beta',
        role: 'admin',
        extension: 'EXT-402',
      };

      setUser(user);
      setCurrentUser(user);

      // Clean browser history
      window.history.replaceState({}, document.title, '/');
      navigate('/', { replace: true });
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
