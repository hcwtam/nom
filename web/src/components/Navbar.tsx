import { Button, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useMeQuery } from '../generated/graphql';
import Login from './Login';
import Logout from './Logout';
import Register from './Register';

export default function Navbar(): ReactElement {
  const router = useRouter();
  const { data } = useMeQuery();

  return (
    <Flex
      as="nav"
      w="100%"
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
            <Register />
            <Login />
          </>
        ) : (
          <>
            <Button mr={4} onClick={() => router.push('/schedule')}>
              Schedule
            </Button>
            <Button mr={4} onClick={() => router.push('/recipes/create')}>
              Create
            </Button>
            <Logout />
          </>
        )}
      </Flex>
    </Flex>
  );
}
