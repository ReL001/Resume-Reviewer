import React from 'react';
import { useLocation } from 'react-router-dom';
import DebugHelper from '../components/DebugHelper';

/**
 * A debugging component that logs route changes to the console
 */
export const RouteDebug: React.FC = () => {
  const location = useLocation();
  
  return (
    <DebugHelper 
      show={process.env.NODE_ENV === 'development'} 
      label="Current Route"
      value={location.pathname} 
    />
  );
};
