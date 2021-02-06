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
import { Form, Formik } from 'formik';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { MyField } from './form/MyField';

type inputValues = {
  usernameOrEmail: string;
  password: string;
};

export default function Login() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [login] = useLoginMutation();

  const initialValues = {
    usernameOrEmail: '',
    password: ''
  };

  const onSubmit = async (values: inputValues) => {
    console.log(values);

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
    if (!res.errors) onClose();
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
            onSubmit={(values) => onSubmit(values)}
          >
            {({ isSubmitting }) => (
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
