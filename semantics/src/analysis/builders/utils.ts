import { SemanticError } from '#errors/SemanticError.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { ExpressionModel, ListLiteralExpression, LiteralField, MapLiteralExpression, MathExpression, MessageLiteralExpression } from '#model/statement/ExpressionModel.js';
import { RouteStatementModel } from '#model/statement/RouteStatementModel.js';
import { IToken, TokenType } from 'npl-syntax';

// For situations where multiple statements are permitted within {} scope
// or a single statement is permitted on the same line. Returns true if a
// scope block was enetered and false if a single statement was built or no
// statements are present (definition only).
export function hasScopeBlock(
    tokens: ITokenStream,
    model: { comments: string[] },
    builder: { buildStatement: (tokens: ITokenStream, token: IToken) => void },
): boolean {
    const token = tokens.next();

    if (token.tokenType == 'LineBreak') {
        tokens.attachCommentsTo(model);
        return false;
    }

    if (token.tokenType == 'StartScope') {
        if (tokens.peek()?.tokenType == 'EndScope') {
            const closeToken = tokens.next();
            extractLineBreak(tokens, '{}');
            tokens.attachCommentsTo(model);
            return false;
        }
        extractLineBreak(tokens, '{');
        tokens.attachCommentsTo(model);
        return true;
    }

    tokens.attachCommentsTo(model);
    builder.buildStatement(tokens, token);
    return false;
}

// For semantic structures that allow a single statement of the same line
// or no statement, or a set of statements within a scope bloak. Returns
// after the scope block has been fully built.
export function buildScopedStatements(
    tokens: ITokenStream,
    model: { comments: string[] },
    builder: { buildStatement: (tokens: ITokenStream, token: IToken) => void },
): void {
    if (!hasScopeBlock(tokens, model, builder)) return;

    let token = tokens.next();
    while (token.tokenType != 'EndScope') {
        if (token.tokenType != 'LineBreak') builder.buildStatement(tokens, token);
        token = tokens.next();
    }

    extractLineBreak(tokens, '}', model);
}

// Expects the next token to be a link break that ends the definition
export function extractLineBreak(tokens: ITokenStream, where: string, model?: { comments: string[] }): void {
    const token = tokens.next();
    if (token.tokenType != 'LineBreak') throw new SemanticError('line break after ' + where, tokens, token);

    if (model) tokens.attachCommentsTo(model);
}

// During debug session it can be helpful to substitute
// regular build function to skip contents of scope block
export function skipScopeBlock(tokens: ITokenStream) {
    let token = tokens.next();
    if (token.tokenType == 'LineBreak') return;
    if (token.tokenType != 'StartScope') throw new SemanticError('{', tokens, token);

    let depth = 0;
    while (true) {
        token = tokens.next();
        if (token.tokenType == 'StartScope') depth++;
        else if (token.tokenType == 'EndScope') {
            if (depth == 0) {
                token = tokens.next();
                if (token.tokenType != 'LineBreak') throw new SemanticError('line break after }', tokens, token);
                return;
            } else {
                depth--;
            }
        }
    }
}

function extractMathExpression(tokens: ITokenStream, token: IToken): MathExpression {
    const tokenList: IToken[] = [];
    let depth = 0;
    while (true) {
        if (token.tokenType == 'LineBreak') {
            if (depth == 0) {
                return { tokens: tokenList };
            }
        } else if (token.tokenType == 'StartCallParams')
            depth++;
        else if (token.tokenType == 'EndCallParams')
            depth--;
        tokenList.push(token);
        token = tokens.next();
    }
}

function extractMapLiteralExpression(tokens: ITokenStream, token: IToken): MapLiteralExpression {
    const fields: LiteralField[] = [];

    var token = tokens.next();
    while(token.tokenType != 'EndMapLiteral') {
        if (token.tokenType == 'LineBreak') {
            token = tokens.next();
            continue;
        }
        if (token.tokenType != 'Identifier')
            throw new SemanticError('field name', tokens, token)
        const field: LiteralField = {
            comments: [],
            fieldName: token.text,
            fieldValue: {
                expressionType: 'math',
                expression: {
                    tokens: []
                }
            }
        }
        token = tokens.next()
        tokens.attachCommentsTo(field);
        field.fieldValue = extractExpression(tokens, token);
        fields.push(field);

        token = tokens.next()
    }

    return { fields };
}

 function extractListLiteralExpression(tokens: ITokenStream, token: IToken): ListLiteralExpression {
    const values: ExpressionModel[] = [];

    while(token.tokenType != 'EndListLiteral') {
        token = tokens.next();
        if (token.tokenType != 'LineBreak')
            values.push(extractExpression(tokens, token));
    }
    
    return { values };
}

function extractMessageExpression(tokens: ITokenStream, token: IToken): MessageLiteralExpression {
    const fields: LiteralField[] = [];
    const originContext: LiteralField[] = [];
    const networkContext: LiteralField[] = [];
    const messageContext: LiteralField[] = [];
    const route: RouteStatementModel[] = [];

    const messageType = token.text;
    var token = tokens.next();

    while(token.tokenType != 'EndMessageLiteral') {
        if (token.tokenType == 'LineBreak') {
            token = tokens.next();
            continue;
        }
        if (token.tokenType != 'Identifier')
            throw new SemanticError('message field name', tokens, token)
        const field: LiteralField = {
            comments: [],
            fieldName: token.text,
            fieldValue: {
                expressionType: 'math',
                expression: {
                    tokens: []
                }
            }
        }
        token = tokens.next()
        tokens.attachCommentsTo(field);
        field.fieldValue = extractExpression(tokens, token);
        fields.push(field);

        token = tokens.next()
    }

    // TODO: Context
    // TODO: Route

    return { 
        messageType, 
        fields,
        originContext,
        networkContext,
        messageContext,
        route
    };
}

// Extracts an expression from the token stream.
export function extractExpression(tokens: ITokenStream, token: IToken): ExpressionModel {
    if (token.tokenType == 'StartMessageLiteral') {
        return {
            expressionType: 'message',
            expression: extractMessageExpression(tokens, token)
        }
    } else if (token.tokenType == 'StartMapLiteral') {
        return {
            expressionType: 'map',
            expression: extractMapLiteralExpression(tokens, token)
        }
    } else if (token.tokenType == 'StartListLiteral') {
        return {
            expressionType: 'list',
            expression: extractListLiteralExpression(tokens, token)
        }
    } else {
        return {
            expressionType: 'math',
            expression: extractMathExpression(tokens, token)
        }
    }
}

export function extractIdentifier(tokens: ITokenStream): string {
    const token = tokens.next();
    if (token.tokenType != 'Identifier') throw new SemanticError('an identifier', tokens, token);
    return token.text;
}

export function extractQualifiedIdentifier(tokens: ITokenStream): string {
    const token = tokens.next();
    if (token.tokenType != 'QualifiedIdentifier') throw new SemanticError('a qualified identifier', tokens, token);
    return token.text;
}
