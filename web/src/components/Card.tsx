import { Box, Text, Badge, Image, Spinner, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface CardProps {
  id: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  prepTime: number;
  activeTime: number;
}

export const Card = ({
  title,
  prepTime,
  activeTime,
  imageUrl,
  id
}: CardProps) => {
  const router = useRouter();
  return (
    <Flex
      flexDir="column"
      alignItems="center"
      spacing="1.5rem"
      maxWidth="300px"
      p="2rem"
      m="1rem"
      borderRadius="2xl"
      bg="customGray"
      fontWeight="semibold"
      cursor="pointer"
      transition="0.2s ease-in-out"
      _hover={{ boxShadow: '0 0 10px #fff9ee' }}
      onClick={() => router.push(`/recipes/${id}`)}
    >
      {imageUrl ? (
        <Image
          w="200px"
          h="150px"
          objectFit="cover"
          src={imageUrl}
          alt={title}
          mb={5}
          borderRadius={2}
          fallback={<Spinner />}
        />
      ) : null}
      <Text
        as="h3"
        fontSize="xl"
        fontWeight="semibold"
        w="200px"
        h="60px"
        mb={5}
        noOfLines={2}
        overflow="hidden"
        textOverflow="ellipsis"
        textAlign="center"
      >
        {title}
      </Text>
      <Box>
        <Badge bg="orange.100" color="gray.900" p={2} borderRadius="md" mr={2}>
          <Text borderBottom="1px solid #dadada" fontWeight="normal">
            Total time
          </Text>
          <Text>{prepTime} min</Text>
        </Badge>
        <Badge bg="orange.300" color="gray.900" p={2} borderRadius="md">
          <Text borderBottom="1px solid #dadada" fontWeight="normal">
            Cook time
          </Text>
          <Text>{activeTime} min</Text>
        </Badge>
      </Box>
    </Flex>
  );
};
