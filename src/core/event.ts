type EventType = {
  type: string;
};

type EventSourcedEntity<T> = {
  applyEvent(event: EventType): T;
};

export { EventType, EventSourcedEntity };
