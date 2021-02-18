import { Button, useMediaQuery } from '@chakra-ui/react';
import { useLogoutMutation } from '../generated/graphql';
import { useApolloClient } from '@apollo/client';

export default function Logout() {
  const [isLargerThan640] = useMediaQuery('(min-width: 640px)');
  const apolloClient = useApolloClient();
  const [logout, { loading }] = useLogoutMutation();

  return (
    <Button
      px={isLargerThan640 ? '20px' : '10px'}
      onClick={async () => {
        await logout();
        await apolloClient.resetStore();
      }}
      isLoading={loading}
    >
      Logout
    </Button>
  );
}
