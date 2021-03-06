import { Recipe } from '../entities/Recipe';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
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
import { getConnection, getRepository } from 'typeorm';
import { User } from '../entities/User';
import { RecipeInput } from './types';
import { Step } from '../entities/Step';
import { Ingredient } from '../entities/Ingredient';

@ObjectType()
class pagninatedRecipes {
  @Field(() => [Recipe])
  recipes: Recipe[];

  @Field()
  hasMore: boolean;
}

@Resolver(Recipe)
export class RecipeResolver {
  @FieldResolver(() => User)
  async creator(@Root() recipe: Recipe, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(recipe.creatorId);
  }
  @FieldResolver(() => [Step])
  async steps(@Root() recipe: Recipe) {
    return Step.find({ where: { recipeId: recipe.id } });
  }
  @FieldResolver(() => [Ingredient])
  async ingredients(@Root() recipe: Recipe) {
    return Ingredient.find({ where: { recipeId: recipe.id } });
  }

  @Query(() => pagninatedRecipes)
  async recipes(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<pagninatedRecipes> {
    const trueLimit = Math.min(50, limit);
    const trueLimitPlusOne = trueLimit + 1;

    let qb = getConnection()
      .getRepository(Recipe)
      .createQueryBuilder('r')
      .orderBy('"createdAt"', 'DESC')
      .take(trueLimitPlusOne);

    if (cursor)
      qb = qb.where('"createdAt" < :cursor', { cursor: new Date(+cursor) });

    const recipes = await qb.getMany();

    return {
      recipes: recipes.slice(0, trueLimit),
      hasMore: recipes.length === trueLimitPlusOne
    };
  }

  @Query(() => Recipe)
  async recipe(@Arg('id') id: number): Promise<Recipe | undefined> {
    return Recipe.findOne(id);
  }

  @Mutation(() => Recipe)
  @UseMiddleware(isAuth)
  async createRecipe(
    @Arg('input') input: RecipeInput,
    @Ctx() { req }: MyContext
  ): Promise<Recipe> {
    const steps: Step[] = [];
    const ingredients: Ingredient[] = [];

    for (const stepInput of input.steps) {
      const step = await Step.create({ ...stepInput }).save();
      steps.push(step);
    }

    for (const ingredientInput of input.ingredients) {
      const ingredient = await Ingredient.create({ ...ingredientInput }).save();
      ingredients.push(ingredient);
    }

    const recipe = await Recipe.create({
      title: input.title,
      description: input.description,
      prepTime: input.prepTime,
      activeTime: input.activeTime,
      imageUrl: input.imageUrl,
      ingredients,
      steps,
      creatorId: req.session.userId
    }).save();

    return recipe;
  }

  @Mutation(() => Recipe)
  async updateRecipe(
    @Arg('id') id: number,
    @Arg('title') title: string
  ): Promise<Recipe | null> {
    const recipe = await Recipe.findOne(id);
    if (!recipe) return null;
    if (typeof title !== 'undefined') {
      recipe.title = title;
      await Recipe.save(recipe);
    }
    return recipe;
  }

  @Mutation(() => Recipe)
  async deleteRecipe(@Arg('id') id: number): Promise<boolean> {
    await Recipe.delete(id);
    return true;
  }

  @Query(() => [Recipe])
  async paths(): Promise<Recipe[]> {
    return Recipe.find();
  }

  @Query(() => [Recipe])
  async search(@Arg('title') title: string): Promise<Recipe[]> {
    return getRepository(Recipe)
      .createQueryBuilder()
      .select()
      .where('title ILIKE :title', { title: `%${title}%` })
      .getMany();
  }
}
