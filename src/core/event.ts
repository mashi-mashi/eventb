type EventType = {
  entityId: string
  type: string
}

type EventSourcedEntity<E extends EventType, T> = {
  readonly kind: string
  readonly events: E[]
  readonly lastEvent: E | undefined

  applyEvent(event: E): T

  clearEvents(): T
}

export { EventType, EventSourcedEntity }
