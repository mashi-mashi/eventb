type Event = {
  type: string;
};

type EventSourcedEntity<T> = {
  applyEvent(event: Event): T;
};

export { Event, EventSourcedEntity };
