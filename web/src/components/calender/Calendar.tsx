import {
  Calendar as reactBigCalendar,
  CalendarProps,
  momentLocalizer,
  ToolbarProps
} from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import React, { ComponentClass, useState } from 'react';
import { Text, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { EventType } from '../../types';
import { useUpdateEventMutation } from '../../generated/graphql';
import EventModal from './EventModal';
import { stylingEvent } from '../../utils/utils';

interface Props {
  events: EventType[];
  setEvents: React.Dispatch<React.SetStateAction<EventType[] | null>>;
  setSelectedSlot: React.Dispatch<
    React.SetStateAction<{
      start: string;
    } | null>
  >;
  onOpen: () => void;
}

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(
  reactBigCalendar as ComponentClass<CalendarProps<EventType, object>, any>
);

const Calendar = ({ events, setEvents, onOpen, setSelectedSlot }: Props) => {
  const {
    isOpen: isEMOpen,
    onOpen: onEMOpen,
    onClose: onEMClose
  } = useDisclosure();

  const [currentEvent, setCurrentEvent] = useState<EventType | null>(null);
  const [updateEvent] = useUpdateEventMutation();

  const onEventDrop = async (data: any) => {
    const { start, end, event } = data;
    const id = event.resourceId;

    const newEvents = events.map((event) =>
      event.resourceId === id ? { ...event, start, end } : event
    );
    setEvents(newEvents);
    const res = await updateEvent({
      variables: { id, date: start }
    });
    if (!res.data) setEvents((prev) => prev);
  };

  const onSelectSlot = (slotInfo: any) => {
    console.log(slotInfo);
    setSelectedSlot(slotInfo);
    onOpen();
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
    <>
      <DnDCalendar
        components={{
          toolbar
        }}
        defaultDate={moment().toDate()}
        defaultView="month"
        events={events}
        eventPropGetter={(event: object) => {
          return stylingEvent(event);
        }}
        localizer={localizer}
        onEventDrop={onEventDrop}
        onSelectEvent={(event: EventType) => {
          setCurrentEvent(event);
          onEMOpen();
        }}
        onSelectSlot={onSelectSlot}
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

      <EventModal
        isOpen={isEMOpen}
        onOpen={onEMOpen}
        onClose={onEMClose}
        event={currentEvent}
        setEvents={setEvents}
      />
    </>
  );
};

export default Calendar;
