export type CreateRecipeInput = {
  title: string;
  description: string;
  imageUrl: string;
  prepTime: string;
  activeTime: string;
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

export type EventType = {
  start: Date;
  end: Date;
  title: string;
  resourceId: number;
  type?: string;
  imageUrl?: string | null | undefined;
  recipeId?: number | null | undefined;
};
