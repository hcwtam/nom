import { Container } from '../../components/Container';
import { Main } from '../../components/Main';
import {
  Text,
  Image,
  Spinner,
  Flex,
  OrderedList,
  UnorderedList,
  ListItem,
  Box,
  Button
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
  PathsDocument,
  PathsQuery,
  RecipeDocument,
  RecipeQuery,
  useRecipeQuery
} from '../../generated/graphql';
import { GetStaticPaths, GetStaticProps } from 'next';
import { initializeApollo } from '../../lib/apollo';
import Navbar from '../../components/Navbar';
import React from 'react';
import CopyArea from '../../components/CopyArea';
import { createIngredientString, generateTextFile } from '../../utils/utils';

const Recipe = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const { data, loading } = useRecipeQuery({ variables: { id: intId } });

  if (loading)
    return (
      <Container minH="100vh">
        <Spinner />
      </Container>
    );

  if (!data?.recipe)
    return (
      <Container>
        <div>No such recipe.</div>
      </Container>
    );

  let steps,
    ingredients,
    content: string[] = [];
  if (data) {
    steps = data.recipe.steps.map((step) => (
      <ListItem key={step.step}>{step.description}</ListItem>
    ));

    ingredients = data.recipe.ingredients.map((ingredient) => {
      const ingItem = createIngredientString(ingredient);
      content.push(ingItem);
      return <ListItem key={ingredient.name}>{ingItem}</ListItem>;
    });
  }
  return (
    <Container pb={50}>
      <Navbar />
      <Main>
        {data?.recipe.imageUrl ? (
          <Image
            objectFit="cover"
            src={data?.recipe.imageUrl}
            alt={data?.recipe.title}
            mb={5}
            borderRadius={2}
            fallback={<Spinner />}
          />
        ) : null}
        <Text as="h1" fontSize="3rem" fontWeight="600">
          {data?.recipe.title}
        </Text>
        <Text>
          Author:
          <Box as="span" fontWeight="600" display="inline-block" ml={2}>
            {' '}
            {data?.recipe.creator.username}
          </Box>
        </Text>
        <Text>{data?.recipe.description}</Text>
        <Box>
          <Text as="h3" mb={2} fontWeight="600" fontSize="1.5rem">
            Ingredients
          </Text>
          <UnorderedList>{ingredients}</UnorderedList>
          <Text mt={8} mb={4}>
            Copy ingredients to clipboard:
          </Text>
          <CopyArea content={content.join('\n')} />
          <Text mt={8} mb={4}>
            Or download grocery list as text file:
          </Text>
          <Button
            w="100%"
            colorScheme="orange"
            bg="orange.500"
            color="white"
            opacity={0.8}
            onClick={() => generateTextFile(content.join('\n'))}
          >
            Generate grocery list
          </Button>
        </Box>
        <Flex w="100%">
          <Box>
            <Text as="h3" mb={2} fontWeight="600" fontSize="1.5rem">
              Steps
            </Text>
            <OrderedList>{steps}</OrderedList>
          </Box>
        </Flex>
      </Main>
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo();

  const res = await apolloClient.query<PathsQuery>({
    query: PathsDocument
  });
  return {
    paths: res.data.paths.map(({ id }) => ({
      params: { id: id.toString() }
    })),
    fallback: true
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = typeof params?.id === 'string' ? parseInt(params.id) : -1;
  const apolloClient = initializeApollo();

  await apolloClient.query<RecipeQuery>({
    query: RecipeDocument,
    variables: { id }
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract()
    },
    revalidate: 15
  };
};

export default Recipe;
