"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv-safe/config");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./constants");
const recipe_1 = require("./resolvers/recipe");
const Recipe_1 = require("./entities/Recipe");
const User_1 = require("./entities/User");
const user_1 = require("./resolvers/user");
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const createUserLoader_1 = require("./utils/createUserLoader");
const Ingredient_1 = require("./entities/Ingredient");
const Step_1 = require("./entities/Step");
const Event_1 = require("./entities/Event");
const createRecipeLoader_1 = require("./utils/createRecipeLoader");
const event_1 = require("./resolvers/event");
const main = async () => {
    await typeorm_1.createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: !constants_1.__prod__,
        synchronize: true,
        entities: [User_1.User, Recipe_1.Recipe, Ingredient_1.Ingredient, Step_1.Step, Event_1.Event]
    });
    await User_1.User.delete({});
    await Recipe_1.Recipe.delete({});
    await Ingredient_1.Ingredient.delete({});
    await Step_1.Step.delete({});
    await Event_1.Event.delete({});
    const app = express_1.default();
    const RedisStore = connect_redis_1.default(express_session_1.default);
    const redis = new ioredis_1.default(process.env.REDIS_URL);
    app.set('trust proxy', 1);
    app.use(cors_1.default({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }));
    app.use(express_session_1.default({
        store: new RedisStore({ client: redis, disableTouch: true }),
        name: constants_1.COOKIE_NAME,
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            secure: constants_1.__prod__,
            sameSite: 'none',
            domain: constants_1.__prod__ ? '.wesleytam.xyz' : undefined
        }
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await type_graphql_1.buildSchema({
            resolvers: [recipe_1.RecipeResolver, user_1.UserResolver, event_1.EventResolver],
            validate: false
        }),
        context: ({ req, res }) => ({
            req,
            res,
            redis,
            userLoader: createUserLoader_1.createUserLoader(),
            recipeLoader: createRecipeLoader_1.createRecipeLoader()
        })
    });
    apolloServer.applyMiddleware({
        app,
        cors: false
    });
    app.listen(parseInt(process.env.PORT), () => {
        console.log('server up and running');
    });
};
main();
//# sourceMappingURL=index.js.map