import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
  isRequired?: boolean;
};

export const MyField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  isRequired = false,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl
      id={props.name}
      isRequired={isRequired}
      mb={4}
      isInvalid={!!error}
    >
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      {!textarea ? (
        <Input placeholder={props.placeholder} {...field} />
      ) : (
        <Textarea placeholder={props.placeholder} {...field} />
      )}
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
