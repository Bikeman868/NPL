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
  | 'route';

export interface IParserState {
  state: StateName;
  subState: string;

  getDescription(): string;
}
