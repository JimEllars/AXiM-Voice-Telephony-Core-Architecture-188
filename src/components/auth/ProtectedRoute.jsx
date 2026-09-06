import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken, getUserRole, redirectToLogin } from '../../lib/auth';
import { useVoiceStore } from '../../store/useVoiceStore';

export const ProtectedRoute = ({ children, requireRole }) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const location = useLocation();
  const token = getAuthToken();
  const role = getUserRole();
  const user = useVoiceStore((state) => state.currentUser);

  useEffect(() => {
    if (!token) {
      redirectToLogin();
    } else {
      setIsVerifying(false);
    }
  }, [token]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Allow access for specific roles related to telephony management
  const allowedRoles = ['telephony', 'support', 'admin', 'super_user'];

  if (!role || !allowedRoles.includes(role)) {
    // If not one of the allowed roles, deny access and send to login/root
    redirectToLogin();
    return null; // Return null so the navigation takes over
  }

  if (requireRole && requireRole.length > 0) {
    if (!requireRole.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};
