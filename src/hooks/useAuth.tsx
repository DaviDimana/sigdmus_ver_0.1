
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';

export const useAuth = () => {
  const { authState, setAuthState } = useAuthState();
  const authActions = useAuthActions(authState, setAuthState);

  return {
    ...authState,
    ...authActions,
  };
};
