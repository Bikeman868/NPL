export type StateName =
  | 'SourceFile'
  | 'UsingIdentifier'
  | 'NamespaceIdentifier'
  | 'NamespaceDefinition'
  | 'ApplicationIdentifier'
  | 'ApplicationDefinition'
  | 'NetworkIdentifier'
  | 'NetworkDefinition'
  | 'MessageIdentifier'
  | 'MessageDefinition'
  | 'ConfigDefinition'
  | 'ConnectionIdentifier'
  | 'ConnectionDefiition';

export interface IParserState {
  state: StateName;

  getDescription(): string;
}
