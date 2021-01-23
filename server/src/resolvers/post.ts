import { Post } from '../entities/Post';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from 'type-graphql';
import { MyContext } from '../types';
import { isAuth } from '../middleware/isAuth';
import { getConnection } from 'typeorm';
import { Upvote } from '../entities/Upvote';
import { User } from '../entities/User';

@InputType()
class PostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}

@ObjectType()
class pagninatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => User)
  async creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creatorId);
  }

  @Query(() => pagninatedPosts)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<pagninatedPosts> {
    const trueLimit = Math.min(50, limit);
    const trueLimitPlusOne = trueLimit + 1;

    let qb = getConnection()
      .getRepository(Post)
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

  @Query(() => Post)
  async post(@Arg('id') id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('input') input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({ ...input, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg('id') id: number,
    @Arg('title') title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) return null;
    if (typeof title !== 'undefined') {
      post.title = title;
      await Post.save(post);
    }
    return post;
  }

  @Mutation(() => Post)
  async deletePost(@Arg('id') id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg('value', () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpvote = value !== -1;
    const updatedValue = isUpvote ? 1 : -1;
    const userId = req.session.userId;

    // check if user has voted before
    const upvote = await Upvote.findOne({ where: { postId, userId } });
    if (upvote && upvote.value !== updatedValue) {
      //user changing their vote
      getConnection().transaction(async (tm) => {
        await tm.query(
          `
          update upvote
          set value = $1
          where "postId" = $2 and "userId" = $3
`,
          [updatedValue, postId, userId]
        );

        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2
`,
          [2 * updatedValue, postId]
        );
      });
    } else if (!upvote) {
      //user never voted before
      getConnection().transaction(async (tm) => {
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
}
