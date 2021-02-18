import { Stack, StackProps } from '@chakra-ui/react';

export const Main = (props: StackProps) => (
  <Stack
    spacing="1.5rem"
    width="100%"
    maxWidth="60rem"
    pt="3rem"
    px="1rem"
    mx="auto"
    {...props}
  />
);
