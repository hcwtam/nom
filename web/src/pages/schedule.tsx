import { Button, Spinner, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import Calendar from '../components/calender/Calendar';
import CalendarModal from '../components/calender/CalendarModal';
import GenFileModal from '../components/calender/GenFileModal';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import Navbar from '../components/Navbar';
import { useEventsQuery, Event } from '../generated/graphql';
import { useNotAuth } from '../hooks/useNotAuth';
import { EventType } from '../types';
import { transformToCalendarEvent } from '../utils/utils';

const Schedule = () => {
  const { data, loading, error } = useEventsQuery();
  const [events, setEvents] = useState<EventType[] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: string } | null>(
    null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isGenModalOpen,
    onOpen: onGenModalOpen,
    onClose: onGenModalClose
  } = useDisclosure();

  useNotAuth(error);

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
  if (!events && eventsFromQuery) {
    setEvents(eventsFromQuery);
  }

  return events ? (
    <Container>
      <Navbar />
      <Main>
        <Calendar
          events={events}
          setEvents={setEvents}
          onOpen={onOpen}
          setSelectedSlot={setSelectedSlot}
        />
        <CalendarModal
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          setEvents={setEvents}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
        />
        <GenFileModal isOpen={isGenModalOpen} onClose={onGenModalClose} />
        <Button mb={10} onClick={() => onGenModalOpen()}>
          Generate grocery list
        </Button>
      </Main>
    </Container>
  ) : (
    loadingScreen
  );
};

export default Schedule;
