import { IToken } from "npl-syntax";

export class SemanticError extends Error {
    constructor(message: string, token: IToken) {
        super(message + ' but found ' + token.tokenType + ' "' + token.text + '"');
    }
}
