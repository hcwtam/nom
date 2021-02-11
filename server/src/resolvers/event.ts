import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from 'type-graphql';
import { Event } from '../entities/Event';
import { Recipe } from '../entities/Recipe';
import { User } from '../entities/User';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types';
import { EventInput } from './types';

@Resolver(Event)
export class EventResolver {
  @FieldResolver(() => User)
  async user(@Root() event: Event, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(event.userId);
  }
  @FieldResolver(() => Recipe)
  async recipe(@Root() event: Event, @Ctx() { recipeLoader }: MyContext) {
    return recipeLoader.load(event.recipeId);
  }

  @Query(() => [Event])
  @UseMiddleware(isAuth)
  async events(@Ctx() { req }: MyContext): Promise<Event[]> {
    return Event.find({ where: { userId: req.session.userId } });
  }

  //   @Query(() => Recipe)
  //   async event(@Arg('id') id: number): Promise<Recipe | undefined> {
  //     return Recipe.findOne(id);
  //   }

  @Mutation(() => Event)
  @UseMiddleware(isAuth)
  async createEvent(
    @Arg('input') input: EventInput,
    @Ctx() { req }: MyContext
  ): Promise<Event> {
    const event = await Event.create({
      date: input.date,
      type: input.type,
      recipeId: input.recipeId,
      userId: req.session.userId
    }).save();

    const user = await User.findOne(req.session.userId);
    if (user) {
      if (user.events) user.events.push(event);
      else user.events = [event];
    }

    return event;
  }

  @Mutation(() => Event)
  async updateEvent(
    @Arg('id') id: number,
    @Arg('date') date: string
  ): Promise<Event | null> {
    const event = await Event.findOne(id);
    if (!event) return null;
    if (typeof date !== 'undefined') {
      event.date = date;
      await Event.save(event);
    }
    return event;
  }

  @Mutation(() => Boolean)
  async deleteEvent(@Arg('id') id: number): Promise<boolean> {
    await Event.delete(id);
    return true;
  }
}
