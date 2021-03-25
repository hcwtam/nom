import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { MyField } from './form/MyField';

type inputValues = {
  username: string;
  email: string;
  password: string;
};

export default function Register() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [register] = useRegisterMutation();

  const initialValues = {
    username: '',
    email: '',
    password: ''
  };

  const onSubmit = async (
    values: inputValues,
    { setErrors }: FormikHelpers<inputValues>
  ) => {
    const res = await register({
      variables: values,
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: 'Query',
            me: data?.register.user
          }
        });
      }
    });
    if (res.errors) console.log(res.errors);
    if (!res.errors && !res.data?.register.errors) onClose();
    if (res.data?.register.errors)
      setErrors(toErrorMap(res.data.register.errors));
  };

  return (
    <>
      <Button ml={4} onClick={onOpen} colorScheme="orange">
        Register
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="rgba(255, 255, 255, 0.2);" />
        <ModalContent bg="#222">
          <ModalHeader textAlign="center">Register</ModalHeader>
          <ModalCloseButton
            _hover={{ boxShadow: '0 0 5px #fff9ee' }}
            _focus={{ boxShadow: 'none' }}
          />
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => onSubmit(values, actions)}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <>
                <Form>
                  <ModalBody>
                    <MyField
                      label="Username"
                      name="username"
                      placeholder="Username"
                      isRequired
                    />
                    <MyField
                      label="Email"
                      name="email"
                      placeholder="Email"
                      type="email"
                      isRequired
                    />
                    <MyField
                      label="Password"
                      name="password"
                      placeholder="Password"
                      type="password"
                      isRequired
                    />
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      colorScheme="orange"
                      w="100%"
                      my={4}
                      isLoading={isSubmitting}
                      type="submit"
                      disabled={!dirty || !isValid}
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </Form>
              </>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
}
