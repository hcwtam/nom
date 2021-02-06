import { Button } from '@chakra-ui/react';
import { useLogoutMutation } from '../generated/graphql';
import { useApolloClient } from '@apollo/client';

export default function Logout() {
  const apolloClient = useApolloClient();
  const [logout, { loading }] = useLogoutMutation();

  return (
    <Button
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
