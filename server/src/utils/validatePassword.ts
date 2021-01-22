export const validatePassword = (password: string) => {
  if (password.length <= 3) {
    return [
      {
        field: 'password',
        message: 'Password must have at least 4 characters.'
      }
    ];
  }
  return null;
};
