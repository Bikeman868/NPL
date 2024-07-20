import { type IFormatter } from '#interfaces/IFormatter.js'
import { type IToken } from 'npl-parser'

export class Formatter implements IFormatter{
    public format(tokens: IToken[]): string {
        return tokens[0].text
    }
}
