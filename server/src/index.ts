import 'reflect-metadata';
import 'dotenv-safe/config';
import { createConnection } from 'typeorm';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { COOKIE_NAME, __prod__ } from './constants';
import { RecipeResolver } from './resolvers/recipe';
import { Recipe } from './entities/Recipe';
import { User } from './entities/User';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';
import cors from 'cors';
import { createUserLoader } from './utils/createUserLoader';
import { Ingredient } from './entities/Ingredient';
import { Step } from './entities/Step';
import { Event } from './entities/Event';
import { createRecipeLoader } from './utils/createRecipeLoader';
import { EventResolver } from './resolvers/event';

const main = async () => {
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: !__prod__,
    // migrations: [path.join(__dirname, './migrations/*')],
    synchronize: true,
    entities: [User, Recipe, Ingredient, Step, Event]
  });

  // await connection.runMigrations();
  await User.delete({});
  await Recipe.delete({});
  await Ingredient.delete({});
  await Step.delete({});
  await Event.delete({});

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.set('trust proxy', 1);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true
    })
  );

  app.use(
    session({
      store: new RedisStore({ client: redis, disableTouch: true }),
      name: COOKIE_NAME,
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: __prod__, // cookies only work in https
        sameSite: 'lax'
      }
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [RecipeResolver, UserResolver, EventResolver],
      validate: false
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      recipeLoader: createRecipeLoader()
    })
  });

  apolloServer.applyMiddleware({
    app,
    cors: false
  });

  app.listen(parseInt(process.env.PORT!), () => {
    console.log('server up and running');
  });
};

main();
