import {
  Button,
  Container,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text
} from '@chakra-ui/react';
import moment from 'moment';
import React, { ComponentClass, useState } from 'react';
import {
  Calendar as reactBigCalendar,
  CalendarProps,
  momentLocalizer,
  ToolbarProps
} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { useEventsQuery, Event } from '../../generated/graphql';
import { EventType } from '../../types';
import {
  compileIngredientsToText,
  createIngredientString,
  generateTextFile,
  stylingEvent,
  transformToCalendarEvent
} from '../../utils/utils';
import { Main } from '../Main';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type SlotInfoType = {
  start: string | Date;
  end: string | Date;
  slots: string[] | Date[];
  action: 'select' | 'click' | 'doubleClick';
};

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(
  reactBigCalendar as ComponentClass<CalendarProps<EventType, object>, any>
);

const GenFileModal = ({ isOpen, onClose }: Props) => {
  const { data, loading, error } = useEventsQuery();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const loadingScreen = (
    <Container>
      <Main>
        <Spinner />
      </Main>
    </Container>
  );

  if (loading) return loadingScreen;
  if (error)
    return <Container>We have trouble getting your schedule.</Container>;

  let eventsFromQuery: EventType[] | undefined;
  if (data && data.events)
    eventsFromQuery = transformToCalendarEvent(data.events as Event[]);

  // select slots
  const onSelecting = (slotInfo: SlotInfoType) => {
    // Two scenarios: drag multiple slots and click on one slot
    const { start, end } = slotInfo;

    // multiple slots
    if (start.toString() !== end.toString()) {
      const rangeArray: string[] = [];
      let currentDate = new Date(start as Date);
      const dayAfterEnd = new Date(end as Date);
      dayAfterEnd.setDate(dayAfterEnd.getDate() + 1);
      while (currentDate.toString() !== dayAfterEnd.toString()) {
        rangeArray.push(currentDate.toString());
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const filteredDates = rangeArray.filter(
        (e) => !selectedDates.includes(e)
      );
      setSelectedDates((prev) => [...prev, ...filteredDates]);
    }
    // one slot
    else {
      const date = start.toString();
      setSelectedDates((prev) =>
        !selectedDates.includes(date)
          ? [...prev, date]
          : // unselect
            prev.filter((selectedDate) => selectedDate !== date)
      );
    }
  };

  const submit = () => {
    const selectedEvents = data?.events?.filter((e) =>
      selectedDates.includes(new Date(e.date).toString())
    );
    const text = compileIngredientsToText(selectedEvents as Event[]);
    if (text) generateTextFile(text);
  };

  const closeModal = () => {
    setSelectedDates([]);
    onClose();
  };

  const toolbar = ({ label, onNavigate }: ToolbarProps) => (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      p={2}
      pb={3}
      bg="orange.200"
    >
      <Button onClick={() => onNavigate('PREV')}>Previous</Button>
      <Text fontWeight="600" fontSize="1.3rem">
        {label}
      </Text>
      <Button onClick={() => onNavigate('NEXT')}>Next</Button>
    </Flex>
  );

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="3xl">
      <ModalOverlay bg="rgba(255, 255, 255, 0.2);" />
      <ModalContent bg="#222" mt="2.5rem">
        <ModalHeader textAlign="center">Select to include days</ModalHeader>
        <ModalCloseButton
          _hover={{ boxShadow: '0 0 5px #fff9ee' }}
          _focus={{ boxShadow: 'none' }}
        />
        <ModalBody>
          <DnDCalendar
            components={{
              toolbar
            }}
            defaultDate={moment().toDate()}
            defaultView="month"
            events={eventsFromQuery}
            eventPropGetter={(event: object) => {
              return stylingEvent(event);
            }}
            localizer={localizer}
            dayPropGetter={(date) => {
              return selectedDates.includes(date.toString())
                ? { style: { backgroundColor: '#f0e3c8' } }
                : {};
            }}
            onEventDrop={() => {}}
            onSelectSlot={(slotInfo: SlotInfoType) => {
              onSelecting(slotInfo);
            }}
            resizable={false}
            selectable
            style={{
              minHeight: '500px',
              background: '#f9f9f9',
              boxShadow: '0 0 8px #aaa',
              color: '#222'
            }}
            views={['month']}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="orange"
            w="100%"
            my={4}
            type="submit"
            onClick={submit}
          >
            Generate
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GenFileModal;
