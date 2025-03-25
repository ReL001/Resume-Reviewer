import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A debugging component that logs route changes to the console
 */
export const RouteDebug = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Route changed to:', location.pathname);
    console.log('Route state:', location.state);
  }, [location]);
  
  return null; // This component doesn't render anything
};
