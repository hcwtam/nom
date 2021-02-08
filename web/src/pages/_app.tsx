import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';

import theme from '../theme';
import { AppProps } from 'next/app';
import { useApollo } from '../lib/apollo';

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
