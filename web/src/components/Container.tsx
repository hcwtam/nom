import { Flex, FlexProps } from '@chakra-ui/react';

export const Container = (props: FlexProps) => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      bg="customBlack"
      color="white"
      minH="100vh"
      {...props}
    />
  );
};
