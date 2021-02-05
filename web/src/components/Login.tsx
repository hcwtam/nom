import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';

interface Props {}

export default function Login({}: Props): ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Login</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="rgba(255, 255, 255, 0.2);" />
        <ModalContent bg="#222">
          <ModalHeader textAlign="center">Login</ModalHeader>
          <ModalCloseButton
            _hover={{ boxShadow: '0 0 5px #fff9ee' }}
            _focus={{ boxShadow: 'none' }}
          />
          <ModalBody>
            <FormControl id="username" isRequired mb={4}>
              <FormLabel>Username</FormLabel>
              <Input placeholder="Username" />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input placeholder="Password" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="orange" w="100%" my={4}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
