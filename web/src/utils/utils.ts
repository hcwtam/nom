import { Event } from '../generated/graphql';

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
