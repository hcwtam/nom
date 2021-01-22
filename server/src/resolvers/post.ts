import { Post } from '../entities/Post';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { MyContext } from '../types';
import { isAuth } from '../middleware/isAuth';
import { getConnection } from 'typeorm';

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

@Resolver()
export class PostResolver {
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

  // @Mutation(()=>Boolean)
  // @UseMiddleware(isAuth)
  // async vote(
  //   @Arg('postId',()=>Int)postId: number,
  //   @Ctx() {req}:MyContext
  // ) {
  //   const userId = req.session.userId;
  //   return true
  // }
}
