import { Container } from '../../components/Container';
import { Main } from '../../components/Main';
import { Text } from '@chakra-ui/react';

const Recipe = () => {
  return (
    <Container height="100vh">
      <Main>
        <Text as="h1" fontSize="3rem" fontWeight="600">
          Boiled egg
        </Text>
        <Text>A tasty, perfectly-boiled egg.</Text>
      </Main>
    </Container>
  );
};

export default Recipe;
