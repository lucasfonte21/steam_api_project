import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

export const useAuth = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch('/api/auth/me'),
    retry: false,
  });

  return { user: data?.user ?? null, isLoading };
};
