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
  | 'entrypoint';

export interface IParserState {
  state: StateName;
  subState: string;

  getDescription(): string;
}
