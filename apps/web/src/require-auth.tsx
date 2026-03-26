import { JSX } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from './auth-context';
import { RoutePath } from './routes';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={RoutePath.LOGIN} state={{ from: location }} replace />;
  }

  return children;
}
