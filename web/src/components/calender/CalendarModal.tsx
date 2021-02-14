import {
  Button,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useCreateEventMutation } from '../../generated/graphql';
import { EventType } from '../../types';
import SearchBar from '../searchBar/SearchBar';

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setEvents: React.Dispatch<React.SetStateAction<EventType[] | null>>;
  selectedSlot: {
    start: string;
  } | null;
}

export default function CalendarModal({
  isOpen,
  onOpen,
  onClose,
  setEvents,
  selectedSlot
}: Props) {
  const [type, setType] = useState<string | null | undefined>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [createEvent] = useCreateEventMutation();

  const submit = async () => {
    const localEvent = {
      start: new Date(selectedSlot!.start),
      end: new Date(selectedSlot!.start),
      title: selectedRecipe!.label,
      type: type!,
      resourceId: +selectedRecipe!.value
    };
    const event = {
      date: selectedSlot!.start,
      type: type!,
      recipeId: +selectedRecipe!.value
    };
    setEvents((prev) => {
      if (prev) {
        return [...prev, localEvent];
      } else {
        return [localEvent];
      }
    });
    const res = await createEvent({
      variables: { input: event }
    });

    if (!res.data) setEvents((prev) => prev);
    else {
      closeModal();
    }
  };

  const closeModal = () => {
    setType(null);
    setSelectedRecipe(null);
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
    <>
      <Button onClick={onOpen}>Add recipe to calendar</Button>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay bg="rgba(255, 255, 255, 0.2);" />
        <ModalContent bg="#222">
          <ModalHeader textAlign="center">Add recipe to calendar</ModalHeader>
          <ModalCloseButton
            _hover={{ boxShadow: '0 0 5px #fff9ee' }}
            _focus={{ boxShadow: 'none' }}
          />
          <ModalBody>
            <Text mt={4} mb={8} mx={4}>
              Selected date:{' '}
              <strong>{selectedSlot?.start.toString().substring(0, 15)}</strong>
            </Text>
            <Text mt={4} mx={4}>
              Selected recipe:{' '}
              <strong>
                {selectedRecipe ? selectedRecipe.label : 'No recipe selected.'}
              </strong>
            </Text>
            <SearchBar selectResult={(item) => setSelectedRecipe(item)} />
            <Text mt={8} mx={4} mb={4}>
              Selected meal type:{' '}
              <strong style={{ textTransform: 'capitalize' }}>
                {type ? type : 'No type selected.'}
              </strong>
            </Text>
            <Select placeholder="Select meal type">{mealTypeOptions}</Select>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="orange"
              w="100%"
              my={4}
              type="submit"
              disabled={!selectedSlot?.start || !selectedRecipe || !type}
              onClick={submit}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
