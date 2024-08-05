import { SemanticError } from '#errors/SemanticError.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { ExpressionModel, ListLiteralExpression, LiteralField, MapLiteralExpression, MathExpression, MessageLiteralExpression } from '#model/statement/ExpressionModel.js';
import { RouteStatementModel } from '#model/statement/RouteStatementModel.js';
import { IToken } from 'npl-syntax';
import { extractLineBreak, skipScopeBlock } from './utils.js';

// Extracts an expression from the token stream.
export function extractExpression(tokens: ITokenStream, token: IToken): ExpressionModel {
    if (token.tokenType == 'StartMessageLiteral') {
        return {
            expressionType: 'message',
            expression: extractMessageLiteral(tokens, token)
        }
    } else if (token.tokenType == 'StartMapLiteral') {
        return {
            expressionType: 'map',
            expression: extractMapLiteral(tokens, token)
        }
    } else if (token.tokenType == 'StartListLiteral') {
        return {
            expressionType: 'list',
            expression: extractListLiteral(tokens, token)
        }
    } else {
        return {
            expressionType: 'math',
            expression: extractMathExpression(tokens, token)
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

function extractMapLiteral(tokens: ITokenStream, token: IToken): MapLiteralExpression {
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

 function extractListLiteral(tokens: ITokenStream, token: IToken): ListLiteralExpression {
    const values: ExpressionModel[] = [];

    while(token.tokenType != 'EndListLiteral') {
        token = tokens.next();
        if (token.tokenType != 'LineBreak')
            values.push(extractExpression(tokens, token));
    }

    return { values };
}

function extractLiteralField(tokens: ITokenStream, token: IToken): LiteralField {
    if (token.tokenType != 'Identifier')
        throw new SemanticError('field name', tokens, token)
    const field: LiteralField = {
        comments: [],
        fieldName: token.text,
        fieldValue: extractExpression(tokens, tokens.next()),
    }
    tokens.attachCommentsTo(field);
    return field;
}

function extractMessageLiteral(tokens: ITokenStream, token: IToken): MessageLiteralExpression {
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

        if (token.tokenType != 'Keyword')
            throw new SemanticError('message, json, context or route', tokens, token)
        
        if (token.text == 'message') {
            token = tokens.next();
            if (token.tokenType == 'StartScope') {
                extractLineBreak(tokens, 'message {');
                token = tokens.next()
                while (token.tokenType != 'EndScope') {
                    const field = extractLiteralField(tokens, token);
                    fields.push(field);
                    token = tokens.next()
                }
            } else {
                const field = extractLiteralField(tokens, token);
                fields.push(field);
            }
        } else if (token.text == 'json') {
            token = tokens.next();
            if (token.tokenType == 'StringLiteral') {
                const json = token.text;
                // TODO: parse JSON and populate fields
            } else {
                // TODO: sub-expression that evaluates to a string at runtime
                throw new SemanticError('JSON representation as a string literal', tokens, token)
            }
        } else if (token.text == 'context') {
            // TODO: Context
            skipScopeBlock(tokens);
        } else if (token.text == 'route') {
            // TODO: Route
            skipScopeBlock(tokens);
        } else {
            throw new SemanticError('message, context or route', tokens, token)
        }
        token = tokens.next();
    }

    return { 
        messageType, 
        fields,
        originContext,
        networkContext,
        messageContext,
        route
    };
}
