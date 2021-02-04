import { Box, Text, Badge } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export const Card = () => {
  const router = useRouter();
  return (
    <Box
      spacing="1.5rem"
      maxWidth="12rem"
      p="2rem"
      m="1rem"
      borderRadius="2xl"
      bg="customGray"
      fontWeight="semibold"
      cursor="pointer"
      transition="0.2s ease-in-out"
      _hover={{ boxShadow: '0 0 10px #fff9ee' }}
      onClick={() => router.push('/recipes/1')}
    >
      <Text as="h3" fontSize="2xl" fontWeight="semibold" mb={2}>
        Boiled egg
      </Text>
      <Badge bg="orange.200" color="gray.900" p={2} borderRadius="md">
        10 mins
      </Badge>
    </Box>
  );
};
