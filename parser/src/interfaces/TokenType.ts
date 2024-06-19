/**
 * Defines the types of token that can be extracted from the source code
 */
export type TokenType =
    | 'None'
    | 'Keyword'
    | 'Identifier'
    | 'QualifiedIdentifier'
    | 'LineBreak'
    | 'Comment'
    | 'StringLiteral'
    | 'NumberLiteral'
    | 'BooleanLiteral'
    | 'Operator'
    | 'Type'
    | 'ListSeparator'
    | 'StartScope'
    | 'EndScope'
    | 'StartSubExpression'
    | 'EndSubExpression'
    | 'StartListLiteral'
    | 'EndListLiteral'
    | 'StartIndexer'
    | 'EndIndexer'
    | 'StartGeneric'
    | 'EndGeneric'
    | 'StartMessageLiteral'
    | 'EndMessageLiteral'
    | 'StartCallParams'
    | 'EndCallParams';
