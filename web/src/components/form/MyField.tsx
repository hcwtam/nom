import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
  Textarea,
  TextareaProps
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> & {
  label?: string;
  name: string;
  textarea?: boolean;
  isRequired?: boolean;
} & TextareaProps &
  InputProps;

export const MyField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  isRequired = false,
  size: _,
  ...props
}) => {
  const [field, { error, touched }] = useField(props);
  return (
    <FormControl
      id={props.name}
      isRequired={isRequired}
      mb={4}
      isInvalid={!!error && touched}
    >
      {label ? <FormLabel htmlFor={field.name}>{label}</FormLabel> : null}
      {!textarea ? (
        <Input placeholder={props.placeholder} {...field} {...props} />
      ) : (
        <Textarea placeholder={props.placeholder} {...field} {...props} />
      )}
      {error && touched ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
