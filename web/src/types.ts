export type CreateRecipeInput = {
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  activeTime: number;
  steps: {
    description: string;
    step: number;
  }[];
  ingredients: {
    name: string;
    quantity: undefined;
    unit: string;
  }[];
};
