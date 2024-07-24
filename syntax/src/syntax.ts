import { SyntaxGraph } from '#interfaces/SyntaxGraph.js';
import { Parser } from '#parser/Parser.js';
import { Context } from '#parser/Context.js';
import { ParsableString } from '#parser/ParsableString.js';
import { buildNplSyntaxGraph } from '#parser/buildNplSyntaxGraph.js';
import { IToken } from '#interfaces/IToken.js';

export const nplLanguageSyntax: SyntaxGraph = buildNplSyntaxGraph();

export function parse(sourceText: string): IToken[] {
    const buffer = new ParsableString(sourceText);
    const context = new Context(buffer, nplLanguageSyntax);
    return new Parser().parse(context);
}

export { buildInfo } from './buildInfo.js'

export { type IContext } from '#interfaces/IContext.js';
export { type IParsable } from '#interfaces/IParsable.js';
export { type IParser } from '#interfaces/IParser.js';
export { type IToken } from '#interfaces/IToken.js';

export { type ParseResult } from '#interfaces/ParseResult.js';
export { type Position } from '#interfaces/Position.js';
export { type State } from '#interfaces/State.js';
export { type StateTransition } from '#interfaces/StateTransition.js';
export { type SubGraphTransition } from '#interfaces/SubGraphTransition.js';
export { type SyntaxError } from '#interfaces/SyntaxError.js';
export { type SyntaxGraph } from '#interfaces/SyntaxGraph.js';
export { type TokenType } from '#interfaces/TokenType.js';
export { type WhitespaceSkipper } from '#interfaces/WhitespaceSkipper.js';

export { ParsableString } from '#parser/ParsableString.js';
export { Parser } from '#parser/Parser.js';
export { Context } from '#parser/Context.js';
