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
  Box
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRecipeQuery } from '../../generated/graphql';

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

  let steps, ingredients;
  if (data) {
    steps = data.recipe.steps.map((step) => (
      <ListItem>{step.description}</ListItem>
    ));

    ingredients = data.recipe.ingredients.map((ingredient) => (
      <ListItem>
        {ingredient.quantity} {ingredient.unit} {ingredient.name}
      </ListItem>
    ));
  }
  return (
    <Container pb={50}>
      <Main>
        <Image
          objectFit="cover"
          src={data?.recipe.imageUrl || ''}
          alt={data?.recipe.title}
          mb={5}
          borderRadius={2}
          fallback={<Spinner />}
        />
        <Text as="h1" fontSize="3rem" fontWeight="600">
          {data?.recipe.title}
        </Text>
        <Text>{data?.recipe.description}</Text>
        <UnorderedList>{ingredients}</UnorderedList>
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

export default Recipe;
