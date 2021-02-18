import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useMediaQuery
} from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { MyField } from './form/MyField';

type inputValues = {
  usernameOrEmail: string;
  password: string;
};

export default function Login() {
  const [isLargerThan640] = useMediaQuery('(min-width: 640px)');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [login] = useLoginMutation();

  const initialValues = {
    usernameOrEmail: '',
    password: ''
  };

  const onSubmit = async (
    values: inputValues,
    { setErrors }: FormikHelpers<inputValues>
  ) => {
    const res = await login({
      variables: values,
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: 'Query',
            me: data?.login.user
          }
        });
      }
    });
    if (!res.errors && !res.data?.login.errors) onClose();
    if (res.data?.login.errors) setErrors(toErrorMap(res.data.login.errors));
  };

  return (
    <>
      <Button ml={4} onClick={onOpen}>
        Login
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="rgba(255, 255, 255, 0.2);" />
        <ModalContent bg="#222">
          <ModalHeader textAlign="center">Login</ModalHeader>
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
                      name="usernameOrEmail"
                      placeholder="Username"
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
                      px={isLargerThan640 ? '20px' : '10px'}
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
