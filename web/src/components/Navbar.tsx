import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import Login from './Login';

export default function Navbar(): ReactElement {
  return (
    <Flex
      as="nav"
      w="100vw"
      h={75}
      px={10}
      justifyContent="space-between"
      alignItems="center"
    >
      <Link href="/">
        <a>Home</a>
      </Link>
      <Flex w={120} justifyContent="space-between">
        <Text>Register</Text>
        <Login />
      </Flex>
    </Flex>
  );
}
