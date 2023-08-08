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
  | 'constant';

export interface IParserState {
  state: StateName;
  subState: string;

  getDescription(): string;
}
