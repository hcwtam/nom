"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./constants");
const post_1 = require("./resolvers/post");
const Post_1 = require("./entities/Post");
const main = async () => {
    await typeorm_1.createConnection({
        type: 'postgres',
        username: 'postgres',
        password: 'postgres',
        database: 'nom',
        logging: constants_1.__prod__,
        synchronize: true,
        entities: [Post_1.Post]
    });
    const app = express_1.default();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await type_graphql_1.buildSchema({
            resolvers: [post_1.PostResolver],
            validate: false
        })
    });
    apolloServer.applyMiddleware({ app });
    app.listen(4000, () => {
        console.log('server up and running');
    });
};
main();
//# sourceMappingURL=index.js.map