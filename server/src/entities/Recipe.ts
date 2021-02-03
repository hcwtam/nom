import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Ingredient } from './Ingredient';
import { Step } from './Step';
import { Upvote } from './Upvote';
import { User } from './User';

@ObjectType()
@Entity()
export class Recipe extends BaseEntity {
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
  title!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field()
  @Column({ type: 'int', default: 0 })
  points: number;

  @Field()
  @Column()
  creatorId: number;

  @ManyToOne(() => User, (user) => user.recipes)
  creator: User;

  @OneToMany(() => Upvote, (upvote) => upvote.recipe)
  upvotes: Upvote[];

  @Field(() => [Step])
  @OneToMany(() => Step, (step) => step.recipe)
  steps: Step[];

  @Field(() => [Ingredient])
  @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe)
  ingredients: Ingredient[];
}