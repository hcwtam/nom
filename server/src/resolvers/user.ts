import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from 'type-graphql';
import { User } from '../entities/User';
import argon2 from 'argon2';
import { MyContext } from '../types';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import { UsernamePasswordInput } from './UsernamePasswordInput';
import { validateRegister } from '../utils/validateRegister';
import { v4 } from 'uuid';
import { sendEmail } from '../utils/sendEmail';
import { validatePassword } from '../utils/validatePassword';

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    // not logged in
    if (!req.session.userId) {
      return null;
    }
    const user = await User.findOne({ id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) return { errors };

    const hashedPassword = await argon2.hash(options.password);
    const user = await User.create({
      username: options.username,
      email: options.email,
      password: hashedPassword
    });
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        // username duplicate error
        return {
          errors: [
            {
              field: 'username',
              message: 'Username has already been taken.'
            }
          ]
        };
      }
    }

    //store userId session
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes('@')
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: 'Login credentials incorrect.'
          }
        ]
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Login credentials incorrect.'
          }
        ]
      };
    }

    req.session.userId = user.id;
    return {
      user
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }

  @Mutation(() => Boolean)
  async forgetPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ email });
    if (!user) {
      // email not in database
      return true;
    }

    const token = v4();
    redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 * 3
    ); //3 days
    const htmlContent = `<a href="http://localhost:3000/change-password/${token}">Reset password</a>`;
    await sendEmail(email, htmlContent);
    return true;
  }

  @Mutation(() => UserResponse)
  async resetPassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { req, redis }: MyContext
  ): Promise<UserResponse> {
    const errors = validatePassword(newPassword);
    if (errors) return { errors };

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = redis.get(key);
    if (!userId)
      return {
        errors: [
          {
            field: 'token',
            message: 'Token expired.'
          }
        ]
      };
    const user = await User.findOne({ id: +userId });
    if (!user)
      return {
        errors: [
          {
            field: 'token',
            message: 'User no longer exists.'
          }
        ]
      };
    await User.update(
      { id: +userId },
      {
        password: await argon2.hash(newPassword)
      }
    );

    await redis.del(key);

    // Logs the user in
    req.session.userId = user.id;

    return { user };
  }
}
