export type StateName =
  | 'sourcefile'
  | 'using'
  | 'namespace'
  | 'application'
  | 'network'
  | 'message'
  | 'connection'
  | 'process'
  | 'object'
  | 'expression'
  | 'constant'
  | 'accept'
  | 'emit'
  | 'route'
  | 'destination'
  | 'entrypoint';

export interface IParserState {
  state: StateName;
  subState: string;

  getDescription(): string;
}
