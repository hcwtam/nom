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

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @Field()
  @Column()
  prepTime: number;

  @Field()
  @Column()
  activeTime: number;

  @Field()
  @Column()
  creatorId: number;

  @ManyToOne(() => User, (user) => user.recipes)
  creator: User;

  @Field(() => [Step])
  @OneToMany(() => Step, (step) => step.recipe)
  steps: Step[];

  @Field(() => [Ingredient])
  @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe)
  ingredients: Ingredient[];
}
