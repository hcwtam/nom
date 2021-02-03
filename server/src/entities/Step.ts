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

@ObjectType()
@Entity()
export class Step extends BaseEntity {
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
  step: number;

  @Field()
  @Column()
  description: string;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  recipeId: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.steps)
  recipe: Recipe;
}
