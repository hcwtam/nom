import { Flex, Text } from '@chakra-ui/react';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import Navbar from '../components/Navbar';
import { useRecipesQuery } from '../generated/graphql';

const Index = () => {
  const { data, error, loading } = useRecipesQuery();

  if (error) return <Text>{error.message}</Text>;

  if (loading) return <Text>Loading...</Text>;

  let cards;

  if (data)
    cards = data.recipes.recipes.map(
      ({ id, prepTime, activeTime, description, title, imageUrl }) => (
        <Card
          key={id}
          title={title}
          prepTime={prepTime}
          activeTime={activeTime}
          description={description}
          id={id}
          imageUrl={imageUrl}
        />
      )
    );

  return (
    <Container minH="100vh">
      <Navbar />
      <Main>
        <Flex align="center" justify="space-between" w="100%" flexWrap="wrap">
          {cards}
        </Flex>
      </Main>
    </Container>
  );
};

export default Index;
