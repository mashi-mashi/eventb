type EventType = {
  type: string;
};

type EventSourcedEntity<E extends EventType, T> = {
  readonly events: E[];
  readonly lastEvent: E;

  applyEvent(event: E): T;

  clearEvents(): T;
};

export { EventType, EventSourcedEntity };
