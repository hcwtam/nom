import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Recipe } from './Recipe';
import { User } from './User';

@ObjectType()
@Entity()
export class Event extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  date: string;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  recipeId: number;

  @ManyToOne(() => Recipe)
  recipe: Recipe;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.events)
  user: User;
}
