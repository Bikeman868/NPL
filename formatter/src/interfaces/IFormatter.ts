import { type IToken } from 'npl-parser'

export interface IFormatter {
    format(tokens: IToken[]): string
}