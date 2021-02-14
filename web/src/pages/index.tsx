import { Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import Navbar from '../components/Navbar';
import SearchBar from '../components/searchBar/SearchBar';
import { useRecipesQuery } from '../generated/graphql';

const Index = () => {
  const router = useRouter();
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
        <SearchBar
          selectResult={(item) => router.push(`/recipes/${item.value}`)}
        />
        <Flex align="center" justify="space-between" w="100%" flexWrap="wrap">
          {cards}
        </Flex>
      </Main>
    </Container>
  );
};

export default Index;
