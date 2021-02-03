import { Box, Text, Badge } from '@chakra-ui/react';

export const Card = () => (
  <Box
    spacing="1.5rem"
    maxWidth="10rem"
    p="1rem"
    borderRadius="2xl"
    bg="gray.800"
  >
    <Text as="h3" fontSize="2xl" fontWeight="semibold">
      Boiled egg
    </Text>
    <Text>Boiled egg</Text>
    <Badge>10 mins</Badge>
  </Box>
);
