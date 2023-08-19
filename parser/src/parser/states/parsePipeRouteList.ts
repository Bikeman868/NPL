import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScopedList } from '../functions/parseScopedList.js';

export function parsePipeRouteList(context: IContext): ParseResult {
  return parseScopedList(context, ['process', 'pipe', 'network' ])
}
