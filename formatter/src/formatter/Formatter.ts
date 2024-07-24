import { type IFormatter } from '#interfaces/IFormatter.js'
import { type IContext } from '#interfaces/IContext.js'
import { type IToken } from 'npl-syntax'

export class Formatter implements IFormatter {
    public format(context: IContext) {
        const tokens = context.getTokenEnumerator();
        const printer = context.getPrinter();

        let token: IToken | undefined = tokens.getNextToken();
        while (token) {
            printer.printKeyword(token.text);
            printer.printSpace();
            token = tokens.getNextToken();
        }
        printer.printNewline();
    }
}
