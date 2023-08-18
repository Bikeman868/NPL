export type TokenType =
  | 'None'
  | 'Keyword'
  | 'Identifier'
  | 'QualifiedIdentifier'
  | 'ScopeStart'
  | 'ScopeEnd'
  | 'Comment'
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'Operator'
  | 'ParamStart'
  | 'ParamEnd'
  | 'OpenParenthesis'
  | 'CloseParenthesis'
  | 'Expression'
  | 'Constant';
