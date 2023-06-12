type ActorType = {
  id: string
}

export type ActorActionType = {
  performAction: <T>(usecaseFunction: (actor: ActorType) => T) => T
}
