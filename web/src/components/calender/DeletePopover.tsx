import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import { useDeleteEventMutation } from '../../generated/graphql';
import { EventType } from '../../types';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEvents: React.Dispatch<React.SetStateAction<EventType[] | null>>;
  id: number | undefined;
  closeModal: () => void;
}

export const DeletePopover = ({
  isOpen,
  setEvents,
  setIsOpen,
  id,
  closeModal
}: Props) => {
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef<any>();
  const [deleteEvent] = useDeleteEventMutation();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay bg="rgba(255, 255, 255, 0.2);">
        <AlertDialogContent bg="#222" mt="5.5rem">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Recipe
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={async () => {
                await deleteEvent({
                  variables: { id: id! },
                  update: (cache) => {
                    cache.evict({ id: `Event:${id}` });
                    onClose();
                    closeModal();
                    setEvents((prev) =>
                      prev!.filter((event) => event.resourceId !== id)
                    );
                  }
                });
              }}
              ml={3}
            >
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
