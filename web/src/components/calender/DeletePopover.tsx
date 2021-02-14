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
  events: EventType[];
  setEvents: React.Dispatch<React.SetStateAction<EventType[] | null>>;
  id: number;
}

export const DeletePopover = ({
  isOpen,
  events,
  setEvents,
  setIsOpen,
  id
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
      <AlertDialogOverlay>
        <AlertDialogContent>
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
                  variables: { id },
                  update: (cache) => {
                    cache.evict({ id: `Event:${id}` });
                    onClose();
                    setEvents(
                      events.filter((event) => event.resourceId !== id)
                    );
                  }
                });
              }}
              ml={3}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
