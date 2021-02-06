import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import { useMeQuery } from '../generated/graphql';
import Login from './Login';
import Logout from './Logout';

export default function Navbar(): ReactElement {
  const { data } = useMeQuery();

  return (
    <Flex
      as="nav"
      w="100vw"
      h={75}
      px={10}
      justifyContent="space-between"
      alignItems="center"
    >
      <Flex justifyContent="space-between">
        <Link href="/">
          <a>Home</a>
        </Link>
        {data?.me ? (
          <Text ml={10}>{`Welcome, ${data.me.username}`}</Text>
        ) : null}
      </Flex>
      <Flex justifyContent="space-between">
        {!data?.me ? (
          <>
            <Text>Register</Text>
            <Login />
          </>
        ) : (
          <Logout />
        )}
      </Flex>
    </Flex>
  );
}
