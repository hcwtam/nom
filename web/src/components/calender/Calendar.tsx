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

interface Props {
  events: EventType[];
  setEvents: React.Dispatch<React.SetStateAction<EventType[] | null>>;
}

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(
  reactBigCalendar as ComponentClass<CalendarProps<object, object>, any>
);

const Calendar = ({ events, setEvents }: Props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(0);

  const onEventDrop = (data: any) => {
    const { start, end, event } = data;
    const id = event.resourceId;
    const newEvents = events.map((event) =>
      event.resourceId === id ? { ...event, start, end } : event
    );
    setEvents(newEvents);
  };

  const onSelectSlot = (slotInfo: any) => {
    console.log(slotInfo);
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
        id={currentEventId}
      />
    </>
  );
};

export default Calendar;
