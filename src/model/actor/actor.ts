type ActorType = {
  id: string
}

export type ActorActionType = {
  performAction: <T>(f: (actor: ActorType) => T) => T
}
