import { Button, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import Footer from '../components/Footer';
import { Main } from '../components/Main';
import Navbar from '../components/Navbar';
import SearchBar from '../components/searchBar/SearchBar';
import { useRecipesQuery } from '../generated/graphql';

const Index = () => {
  const router = useRouter();
  const { data, error, loading, fetchMore } = useRecipesQuery({
    variables: {
      cursor: ''
    }
  });

  if (error) return <Text>{error.message}</Text>;

  if (loading)
    return (
      <Container>
        <Main></Main>
      </Container>
    );

  let cards;

  const loadMoreRecipes = () => {
    fetchMore({
      variables: {
        cursor: data?.recipes.recipes[data.recipes.recipes.length - 1].createdAt
      }
    });
  };

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
        <Flex
          align="flex-start"
          justify="space-around"
          w="100%"
          flexWrap="wrap"
        >
          {cards}
          {data?.recipes.hasMore ? (
            <Button
              onClick={loadMoreRecipes}
              isLoading={loading}
              m="auto"
              my={8}
            >
              load
            </Button>
          ) : null}
        </Flex>
      </Main>
      <Footer />
    </Container>
  );
};

export default Index;
