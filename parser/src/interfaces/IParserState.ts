export type StateName =
  | 'Initial'
  | 'Using'
  | 'Namespace'
  | 'NamespaceDefinition'
  | 'Application'
  | 'ApplicationDefinition'
  | 'Network'
  | 'NetworkDefinition';

export interface IParserState {
  state: StateName;

  getDescription(): string;
}
