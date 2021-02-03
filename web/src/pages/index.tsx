import { Flex } from '@chakra-ui/react';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { Main } from '../components/Main';

const Index = () => (
  <Container height="100vh">
    <Main>
      <Flex align="center" justify="space-between" w="100%">
        <Card />
        <Card />
        <Card />
      </Flex>
    </Main>
  </Container>
);

export default Index;
