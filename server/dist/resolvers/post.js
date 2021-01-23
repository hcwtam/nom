"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const Post_1 = require("../entities/Post");
const type_graphql_1 = require("type-graphql");
const isAuth_1 = require("../middleware/isAuth");
const typeorm_1 = require("typeorm");
const Upvote_1 = require("../entities/Upvote");
const User_1 = require("../entities/User");
let PostInput = class PostInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PostInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PostInput.prototype, "text", void 0);
PostInput = __decorate([
    type_graphql_1.InputType()
], PostInput);
let pagninatedPosts = class pagninatedPosts {
};
__decorate([
    type_graphql_1.Field(() => [Post_1.Post]),
    __metadata("design:type", Array)
], pagninatedPosts.prototype, "posts", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], pagninatedPosts.prototype, "hasMore", void 0);
pagninatedPosts = __decorate([
    type_graphql_1.ObjectType()
], pagninatedPosts);
let PostResolver = class PostResolver {
    async creator(post, { userLoader }) {
        return userLoader.load(post.creatorId);
    }
    async posts(limit, cursor) {
        const trueLimit = Math.min(50, limit);
        const trueLimitPlusOne = trueLimit + 1;
        let qb = typeorm_1.getConnection()
            .getRepository(Post_1.Post)
            .createQueryBuilder('p')
            .orderBy('"createdAt"', 'DESC')
            .take(trueLimitPlusOne);
        if (cursor)
            qb = qb.where('"createdAt" < :cursor', { cursor: new Date(+cursor) });
        const posts = await qb.getMany();
        return {
            posts: posts.slice(0, trueLimit),
            hasMore: posts.length === trueLimitPlusOne
        };
    }
    async post(id) {
        return Post_1.Post.findOne(id);
    }
    async createPost(input, { req }) {
        return Post_1.Post.create(Object.assign(Object.assign({}, input), { creatorId: req.session.userId })).save();
    }
    async updatePost(id, title) {
        const post = await Post_1.Post.findOne(id);
        if (!post)
            return null;
        if (typeof title !== 'undefined') {
            post.title = title;
            await Post_1.Post.save(post);
        }
        return post;
    }
    async deletePost(id) {
        await Post_1.Post.delete(id);
        return true;
    }
    async vote(postId, value, { req }) {
        const isUpvote = value !== -1;
        const updatedValue = isUpvote ? 1 : -1;
        const userId = req.session.userId;
        const upvote = await Upvote_1.Upvote.findOne({ where: { postId, userId } });
        if (upvote && upvote.value !== updatedValue) {
            typeorm_1.getConnection().transaction(async (tm) => {
                await tm.query(`
          update upvote
          set value = $1
          where "postId" = $2 and "userId" = $3
`, [updatedValue, postId, userId]);
                await tm.query(`
          update post
          set points = points + $1
          where id = $2
`, [2 * updatedValue, postId]);
            });
        }
        else if (!upvote) {
            typeorm_1.getConnection().transaction(async (tm) => {
                await tm.query(`
          insert into upvote ("userId", "postId", value)
          values (${userId},${postId},${updatedValue})
`);
                await tm.query(`
          update post
          set points = points + ${updatedValue}
          where id = ${postId};
`);
            });
        }
        return true;
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => User_1.User),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "creator", null);
__decorate([
    type_graphql_1.Query(() => pagninatedPosts),
    __param(0, type_graphql_1.Arg('limit', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('cursor', () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    type_graphql_1.Query(() => Post_1.Post),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    type_graphql_1.Mutation(() => Post_1.Post),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    type_graphql_1.Mutation(() => Post_1.Post),
    __param(0, type_graphql_1.Arg('id')),
    __param(1, type_graphql_1.Arg('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    type_graphql_1.Mutation(() => Post_1.Post),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('postId', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('value', () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "vote", null);
PostResolver = __decorate([
    type_graphql_1.Resolver(Post_1.Post)
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map