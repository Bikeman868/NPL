import { type ITokenEnumerator } from '../../../semantics/src/interfaces/ITokenStream.js'
import { type IContext } from '#interfaces/IContext.js'

export interface IFormatter {
    format(context: IContext): void
}