import { InputType, Field } from 'type-graphql';

@InputType()
export class RecipeInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  time: number;

  @Field(() => [StepInput])
  steps: StepInput[];

  @Field(() => [IngredientInput])
  ingredients: IngredientInput[];
}

@InputType()
class StepInput {
  @Field()
  description: string;

  @Field()
  step: number;
}

@InputType()
class IngredientInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  quantity?: number;

  @Field({ nullable: true })
  unit?: string;
}

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
