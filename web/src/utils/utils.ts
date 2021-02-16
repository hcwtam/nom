import { Event, Ingredient } from '../generated/graphql';

export const generateTextFile = (text: string) => {
  if (text) {
    const element = document.createElement('a');
    const file = new Blob([text.replace(/\n/g, '\r\n')], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = 'recipe.txt';
    document.body.appendChild(element);
    element.click();
  }
};

export const createIngredientString = (
  ingredient: {
    __typename?: 'Ingredient' | undefined;
  } & Pick<Ingredient, 'name' | 'quantity' | 'unit'>
) => {
  return (
    (ingredient.quantity ? ingredient.quantity + ' ' : '') +
    (ingredient.unit ? ingredient.unit + ' ' : '') +
    ingredient.name
  );
};

const formatIngsToString = (ingredients: any) => {
  const textArray: string[] = [];
  for (let name in ingredients) {
    for (let unit in ingredients[name]) {
      textArray.push(
        (ingredients[name][unit] ? ingredients[name][unit] + ' ' : '') +
          (unit && !(unit === '__unitless__' || unit === '__empty__')
            ? unit + ' '
            : '') +
          name
      );
    }
  }
  return textArray.join('\n');
};

export const compileIngredientsToText = (events: Event[]) => {
  const ingredients: Ingredient[] = [];
  // push all ingredients to array
  events.forEach((e) =>
    e.recipe.ingredients.forEach((ing) => ingredients.push(ing))
  );
  // find different ing names
  const names = new Set(ingredients.map((ing) => ing.name));
  const categorisedIngredients: Record<
    string,
    Array<{
      unit: string | null | undefined;
      quantity: number | null | undefined;
    }>
  > = {};
  // make {"name": [...{unit, quantity}...],}
  names.forEach((name) => {
    categorisedIngredients[name] = [];
  });
  ingredients.forEach((ing) =>
    names.forEach((name) => {
      if (ing.name === name)
        categorisedIngredients[name].push({
          unit: ing.unit,
          quantity: ing.quantity
        });
    })
  );
  //
  const IngredientsWithTypes: any = {};
  for (let name in categorisedIngredients) {
    const categorisedTypes: Record<string, number | null> = {};
    categorisedIngredients[name].forEach((ing) => {
      if (ing.quantity) {
        if (ing.unit) {
          //add to exist unit
          if (categorisedTypes[ing.unit]) {
            categorisedTypes[ing.unit]! += ing.quantity;
            //make new unit
          } else categorisedTypes[ing.unit]! = ing.quantity;
        }
        // no unit
        else if (categorisedTypes['__unitless__'])
          categorisedTypes['__unitless__'] += ing.quantity;
        else categorisedTypes['__unitless__'] = ing.quantity;
        // no unit and no quantity
      } else categorisedTypes['__empty__'] = null;
    });
    IngredientsWithTypes[name] = categorisedTypes;
  }
  return formatIngsToString(IngredientsWithTypes);
};

// function changing event background color by type
export const stylingEvent = ({ type }: any) => {
  let background;
  if (type === 'breakfast') background = 'orange';
  if (type === 'lunch') background = 'green';
  if (type === 'dinner') background = '#296fbe';
  if (type === 'snack') background = '#be2929';
  return { style: { background } };
};

export const transformToCalendarEvent = (events: Event[]) => {
  return events.map((event) => ({
    start: new Date(event.date),
    end: new Date(event.date),
    title: event.recipe.title,
    type: event.type,
    resourceId: event.id,
    imageUrl: event.recipe.imageUrl,
    recipeId: event.recipeId
  }));
};
