import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { __prod__ } from './constants';
import { PostResolver } from './resolvers/post';
import { Post } from './entities/Post';

const main = async () => {
  await createConnection({
    type: 'postgres',
    username: 'postgres',
    password: 'postgres',
    database: 'nom',
    logging: __prod__,
    synchronize: true,
    entities: [Post]
  });

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver],
      validate: false
    })
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server up and running');
  });
};

main();
