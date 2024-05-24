export enum NodeStatus {
  Inactive = 'Inactive',
  Running = 'Running',
  Success = 'Success',
  Failed = 'Failed',
}

export enum AbortType {
  None = 'None',
  LowerPriority = 'LowerPriority',
  SelfAbort = 'SelfAbort',
  Both = 'Both',
}