import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  recipes: PagninatedRecipes;
  recipe: Recipe;
  me?: Maybe<User>;
};


export type QueryRecipesArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryRecipeArgs = {
  id: Scalars['Float'];
};

export type PagninatedRecipes = {
  __typename?: 'pagninatedRecipes';
  recipes: Array<Recipe>;
  hasMore: Scalars['Boolean'];
};

export type Recipe = {
  __typename?: 'Recipe';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  points: Scalars['Float'];
  prepTime: Scalars['Float'];
  activeTime: Scalars['Float'];
  creatorId: Scalars['Float'];
  steps: Array<Step>;
  ingredients: Array<Ingredient>;
  creator: User;
};

export type Step = {
  __typename?: 'Step';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  step: Scalars['Float'];
  description: Scalars['String'];
  recipeId?: Maybe<Scalars['Float']>;
};

export type Ingredient = {
  __typename?: 'Ingredient';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  name: Scalars['String'];
  quantity?: Maybe<Scalars['Float']>;
  unit?: Maybe<Scalars['String']>;
  recipeId?: Maybe<Scalars['Float']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
  email: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createRecipe: Recipe;
  updateRecipe: Recipe;
  deleteRecipe: Recipe;
  vote: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  forgetPassword: Scalars['Boolean'];
  resetPassword: UserResponse;
};


export type MutationCreateRecipeArgs = {
  input: RecipeInput;
};


export type MutationUpdateRecipeArgs = {
  title: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationDeleteRecipeArgs = {
  id: Scalars['Float'];
};


export type MutationVoteArgs = {
  value: Scalars['Int'];
  recipeId: Scalars['Int'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationForgetPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};

export type RecipeInput = {
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  prepTime: Scalars['Float'];
  activeTime: Scalars['Float'];
  steps: Array<StepInput>;
  ingredients: Array<IngredientInput>;
};

export type StepInput = {
  description: Scalars['String'];
  step: Scalars['Float'];
};

export type IngredientInput = {
  name: Scalars['String'];
  quantity?: Maybe<Scalars['Float']>;
  unit?: Maybe<Scalars['String']>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UsernamePasswordInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type RecipeQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type RecipeQuery = (
  { __typename?: 'Query' }
  & { recipe: (
    { __typename?: 'Recipe' }
    & Pick<Recipe, 'id' | 'title' | 'description' | 'prepTime' | 'activeTime' | 'imageUrl' | 'createdAt'>
    & { steps: Array<(
      { __typename?: 'Step' }
      & Pick<Step, 'step' | 'description'>
    )>, ingredients: Array<(
      { __typename?: 'Ingredient' }
      & Pick<Ingredient, 'name' | 'quantity' | 'unit'>
    )> }
  ) }
);

export type RecipesQueryVariables = Exact<{ [key: string]: never; }>;


export type RecipesQuery = (
  { __typename?: 'Query' }
  & { recipes: (
    { __typename?: 'pagninatedRecipes' }
    & Pick<PagninatedRecipes, 'hasMore'>
    & { recipes: Array<(
      { __typename?: 'Recipe' }
      & Pick<Recipe, 'id' | 'title' | 'description' | 'prepTime' | 'activeTime' | 'imageUrl'>
    )> }
  ) }
);

export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const RecipeDocument = gql`
    query Recipe($id: Float!) {
  recipe(id: $id) {
    id
    title
    description
    prepTime
    activeTime
    imageUrl
    steps {
      step
      description
    }
    ingredients {
      name
      quantity
      unit
    }
    createdAt
  }
}
    `;

/**
 * __useRecipeQuery__
 *
 * To run a query within a React component, call `useRecipeQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecipeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecipeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRecipeQuery(baseOptions: Apollo.QueryHookOptions<RecipeQuery, RecipeQueryVariables>) {
        return Apollo.useQuery<RecipeQuery, RecipeQueryVariables>(RecipeDocument, baseOptions);
      }
export function useRecipeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecipeQuery, RecipeQueryVariables>) {
          return Apollo.useLazyQuery<RecipeQuery, RecipeQueryVariables>(RecipeDocument, baseOptions);
        }
export type RecipeQueryHookResult = ReturnType<typeof useRecipeQuery>;
export type RecipeLazyQueryHookResult = ReturnType<typeof useRecipeLazyQuery>;
export type RecipeQueryResult = Apollo.QueryResult<RecipeQuery, RecipeQueryVariables>;
export const RecipesDocument = gql`
    query Recipes {
  recipes(limit: 10) {
    recipes {
      id
      title
      description
      prepTime
      activeTime
      imageUrl
    }
    hasMore
  }
}
    `;

/**
 * __useRecipesQuery__
 *
 * To run a query within a React component, call `useRecipesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecipesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecipesQuery({
 *   variables: {
 *   },
 * });
 */
export function useRecipesQuery(baseOptions?: Apollo.QueryHookOptions<RecipesQuery, RecipesQueryVariables>) {
        return Apollo.useQuery<RecipesQuery, RecipesQueryVariables>(RecipesDocument, baseOptions);
      }
export function useRecipesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecipesQuery, RecipesQueryVariables>) {
          return Apollo.useLazyQuery<RecipesQuery, RecipesQueryVariables>(RecipesDocument, baseOptions);
        }
export type RecipesQueryHookResult = ReturnType<typeof useRecipesQuery>;
export type RecipesLazyQueryHookResult = ReturnType<typeof useRecipesLazyQuery>;
export type RecipesQueryResult = Apollo.QueryResult<RecipesQuery, RecipesQueryVariables>;