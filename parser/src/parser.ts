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

export { ParsableString } from '#parser/ParsableString.js';
export { Parser } from '#parser/Parser.js';
export { Context } from '#parser/Context.js';
