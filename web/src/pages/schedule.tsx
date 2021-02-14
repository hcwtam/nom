import { Button, Spinner, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import Calendar from '../components/calender/Calendar';
import CalendarModal from '../components/calender/CalendarModal';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import Navbar from '../components/Navbar';
import { useEventsQuery } from '../generated/graphql';
import { EventType } from '../types';

const Schedule = () => {
  const { data, loading, error } = useEventsQuery();
  const [events, setEvents] = useState<EventType[] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: string } | null>(
    null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  let eventsFromQuery: any;
  if (data && data.events)
    eventsFromQuery = data.events.map((event) => ({
      start: new Date(event.date),
      end: new Date(event.date),
      title: event.recipe.title,
      type: event.type,
      resourceId: event.id
    }));
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
        <Button mb={10}>Generate grocery list</Button>
      </Main>
    </Container>
  ) : (
    loadingScreen
  );
};

export default Schedule;
