export type StateName =
  | 'sourcefile'
  | 'using'
  | 'namespace'
  | 'application'
  | 'network'
  | 'message'
  | 'connection'
  | 'process'
  | 'pipe'
  | 'object'
  | 'expression'
  | 'constant'
  | 'accept'
  | 'emit'
  | 'route'
  | 'networkEntry'
  | 'connectionEntry'
  | 'appendRoute'
  | 'prependRoute'
  | 'clearRoute'
  | 'captureRoute'
  | 'removeRoute'
  | 'ifRoute'
  | 'elseRoute'
  | 'elseifRoute';