import DataLoader from 'dataloader';
import { Recipe } from '../entities/Recipe';

export const createRecipeLoader = () =>
  new DataLoader<number, Recipe>(async (recipeIds) => {
    const recipes = await Recipe.findByIds(recipeIds as number[]);
    const recipeIdToRecipe: Record<number, Recipe> = {};
    recipes.forEach((r) => {
      recipeIdToRecipe[r.id] = r;
    });

    return recipeIds.map((recipeId) => recipeIdToRecipe[recipeId]);
  });
