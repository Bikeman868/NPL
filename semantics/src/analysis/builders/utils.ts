import { SemanticError } from '#errors/SemanticError.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
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
    if (token.tokenType != 'LineBreak') throw new SemanticError('Expecting line break after ' + where, tokens, token);

    if (model) tokens.attachCommentsTo(model);
}

// During debug session it can be helpful to substitute
// regular build function to skip contents of scope block
export function skipScopeBlock(tokens: ITokenStream) {
    let token = tokens.next();
    if (token.tokenType == 'LineBreak') return;
    if (token.tokenType != 'StartScope') throw new SemanticError('Expecting {', tokens, token);

    let depth = 0;
    while (true) {
        token = tokens.next();
        if (token.tokenType == 'StartScope') depth++;
        else if (token.tokenType == 'EndScope') {
            if (depth == 0) {
                token = tokens.next();
                if (token.tokenType != 'LineBreak')
                    throw new SemanticError('Expecting line break after }', tokens, token);
                return;
            } else {
                depth--;
            }
        }
    }
}

// Sets the comments and expression properties of a model by analysing the
// token stream.
export function buildExpression(
    tokens: ITokenStream,
    model: {
        comments: string[];
        expression: IToken[];
    },
): void {
    let depth = 0;
    while (true) {
        const token = tokens.next();
        if (token.tokenType == 'LineBreak') {
            if (depth == 0) {
                tokens.attachCommentsTo(model);
                return;
            }
        } else if (
            token.tokenType == 'StartScope' ||
            token.tokenType == 'StartMessageLiteral' ||
            token.tokenType == 'StartMapLiteral'
        )
            depth++;
        else if (
            token.tokenType == 'EndScope' ||
            token.tokenType == 'EndMessageLiteral' ||
            token.tokenType == 'EndMapLiteral'
        )
            depth--;
        model.expression.push(token);
    }
}

export function extractIdentifier(tokens: ITokenStream): string {
    const token = tokens.next();
    if (token.tokenType != 'Identifier') throw new SemanticError('Expecting an identifier', tokens, token);
    return token.text;
}

export function extractQualifiedIdentifier(tokens: ITokenStream): string {
    const token = tokens.next();
    if (token.tokenType != 'QualifiedIdentifier')
        throw new SemanticError('Expecting a qualified identifier', tokens, token);
    return token.text;
}
