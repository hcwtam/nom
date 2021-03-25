import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

export const useNotAuth = (error: any = null) => {
  const router = useRouter();
  const { data } = useMeQuery();

  useEffect(() => {
    if (
      (error && error.message.includes('Not authenticated.')) ||
      (data && !data.me)
    ) {
      router.push('/');
    }
  }, [error, data]);
};
