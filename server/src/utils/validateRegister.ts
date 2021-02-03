import { UsernamePasswordInput } from 'src/resolvers/types';
import { validatePassword } from './validatePassword';

export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length < 1) {
    return [
      { field: 'username', message: 'Username field must not be empty.' }
    ];
  }
  if (options.username.includes('@')) {
    return [{ field: 'username', message: 'Username cannot contain symbol.' }];
  }
  if (!options.email.includes('@')) {
    return [{ field: 'email', message: 'Invalid email.' }];
  }
  const invalidPassword = validatePassword(options.password);
  if (invalidPassword) return invalidPassword;

  return null;
};
