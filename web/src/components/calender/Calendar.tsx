import {
  Calendar as reactBigCalendar,
  CalendarProps,
  momentLocalizer,
  ToolbarProps
} from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import React, { ComponentClass, useState } from 'react';
import { Text, Button, Flex } from '@chakra-ui/react';
import { EventType } from '../../types';
import { DeletePopover } from './DeletePopover';
import { useUpdateEventMutation } from '../../generated/graphql';

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
  reactBigCalendar as ComponentClass<CalendarProps<object, object>, any>
);

// function changing event background color by type
const stylingEvent = ({ type }: any) => {
  let background;
  if (type === 'breakfast') background = 'orange';
  if (type === 'lunch') background = 'green';
  if (type === 'dinner') background = '#296fbe';
  if (type === 'snack') background = '#be2929';
  return { style: { background } };
};

const Calendar = ({ events, setEvents, onOpen, setSelectedSlot }: Props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(0);
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
        onSelectEvent={({ resourceId }: any) => {
          setIsDeleteOpen(true);
          setCurrentEventId(resourceId);
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
      <DeletePopover
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        events={events}
        setEvents={setEvents}
        id={currentEventId}
      />
    </>
  );
};

export default Calendar;
