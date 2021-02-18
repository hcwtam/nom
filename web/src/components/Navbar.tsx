import {
  Button,
  Flex,
  Text,
  Image,
  Box,
  useMediaQuery
} from '@chakra-ui/react';
import NavLink from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useMeQuery } from '../generated/graphql';
import Login from './Login';
import Logout from './Logout';
import Register from './Register';

export default function Navbar(): ReactElement {
  const [isLargerThan640] = useMediaQuery('(min-width: 640px)');
  const router = useRouter();
  const { data } = useMeQuery();

  return (
    <Flex
      as="nav"
      w="100%"
      h="60px"
      px={isLargerThan640 ? 10 : 2}
      justifyContent="space-between"
      alignItems="flex-end"
    >
      <Flex justifyContent="space-between" alignItems="center" pb="5px">
        <NavLink href="/">
          <a>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              cursor="pointer"
            >
              <Image boxSize="32px" src="/logo.svg" />
              <Box fontSize="24px" fontWeight="600" letterSpacing="2px" ml={1}>
                nom
              </Box>
            </Flex>
          </a>
        </NavLink>
        {data?.me && isLargerThan640 ? (
          <Text
            fontWeight="600"
            ml={10}
            pt="4px"
          >{`Welcome, ${data.me.username}!`}</Text>
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
            <Button
              mr={isLargerThan640 ? 4 : 2}
              px={isLargerThan640 ? '20px' : '10px'}
              onClick={() => router.push('/schedule')}
            >
              Schedule
            </Button>
            <Button
              mr={isLargerThan640 ? 4 : 2}
              px={isLargerThan640 ? '20px' : '10px'}
              onClick={() => router.push('/recipes/create')}
            >
              Create
            </Button>
            <Logout />
          </>
        )}
      </Flex>
    </Flex>
  );
}
