import {
  Button,
  Flex,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useUpdateEventMutation } from '../../generated/graphql';
import { EventType } from '../../types';
import { DeletePopover } from './DeletePopover';

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setEvents: (value: React.SetStateAction<EventType[] | null>) => void;
  event: EventType | null;
}

export default function EventModal({
  isOpen,
  onClose,
  event,
  setEvents
}: Props) {
  const [type, setType] = useState<string | null | undefined>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [updateEvent] = useUpdateEventMutation();
  const submit = async () => {
    setEvents((prev) =>
      prev!.map((e) =>
        e.resourceId === event!.resourceId
          ? ({ ...event!, type } as EventType)
          : e
      )
    );
    const res = await updateEvent({
      variables: { id: event!.resourceId, type }
    });
    if (!res.data) setEvents((prev) => prev);
    else closeModal();
  };

  const closeModal = () => {
    setType(null);
    onClose();
  };

  const mealTypeOptions = ['breakfast', 'lunch', 'dinner', 'snack'].map(
    (type) => (
      <option key={type} value={type} onClick={() => setType(type)}>
        {type}
      </option>
    )
  );

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay bg="rgba(255, 255, 255, 0.2);" />
      <ModalContent bg="#222">
        <ModalHeader textAlign="center">{event?.title}</ModalHeader>
        <ModalCloseButton
          _hover={{ boxShadow: '0 0 5px #fff9ee' }}
          _focus={{ boxShadow: 'none' }}
        />
        <ModalBody>
          <NextLink href={`/recipes/${event?.recipeId}`}>
            <Flex
              cursor="pointer"
              flexFlow="column"
              justifyContent="center"
              alignItems="center"
              w="100%"
              pb="30px"
            >
              {event?.imageUrl ? (
                <Image
                  w="300px"
                  h="200px"
                  objectFit="cover"
                  src={event.imageUrl}
                  alt={event.title}
                  mb="10px"
                  transition="0.2s"
                  _hover={{ transform: 'scale(1.02)' }}
                  borderRadius={2}
                  fallback={<Spinner />}
                />
              ) : null}

              <Link w="100%" textAlign="center" fontWeight="600">
                Visit recipe
              </Link>
            </Flex>
          </NextLink>
          <Select placeholder="Change meal type">{mealTypeOptions}</Select>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="orange"
            my={4}
            type="submit"
            onClick={submit}
            disabled={!type}
          >
            Make change
          </Button>
          <Button
            colorScheme="red"
            ml={2}
            my={4}
            type="button"
            onClick={() => setIsDeleteOpen(true)}
          >
            Delete
          </Button>
          <DeletePopover
            isOpen={isDeleteOpen}
            setIsOpen={setIsDeleteOpen}
            setEvents={setEvents}
            id={event?.resourceId}
            closeModal={onClose}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
