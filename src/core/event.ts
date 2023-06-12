export type EventType = {
  entityId: string
  type: string
}

export type EventSourcedEntity<E extends EventType, T> = {
  readonly kind: string
  readonly events: E[]
  readonly lastEvent: E | undefined

  applyEvent(event: E): T

  clearEvents(): T
}
