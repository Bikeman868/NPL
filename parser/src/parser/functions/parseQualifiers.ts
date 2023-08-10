import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { openScope } from '#interfaces/IParsable.js';

/**
 * Generic parsing of this structure:
 *   <keyword> <qualifier>...<qualifier> <identifier> { <scope> }
 * 
 * Assumes that the cursor is at the first character of the first qualifier or the identifier
 * Assumes that the keyword token already pushed a new scope
 * The scope and identifier are both optional
 * When the identifier is present, transitions to next state in 'scope' sub-state with the cursor on {}
 * When scope is present, transitions to 'definition' sub-state with the cursor on the begining of the scope
 * When no scope present, pops the state and leaves the curson on whatever comes next
 */
export function parseQualifiers(context: IContext, qualifiers: string[]): ParseResult {
    const qualifierOrIdentifier = context.buffer.extractToEnd(openScope);
    context.buffer.skipSepararator();
  
    // Optional qualifiers    
    if (qualifiers.includes(qualifierOrIdentifier)) {
      return { text: qualifierOrIdentifier, tokenType: 'Keyword' };
    }
  
    // Optional identifier
    if (qualifierOrIdentifier) {
      context.setSubState('scope')
      return { text: qualifierOrIdentifier, tokenType: 'Identifier' };
    }
  
    // Optional scope block
    if (context.buffer.hasScope()) {
      context.buffer.skipCount(1);
      context.buffer.skipWhitespace();
      context.setSubState('definition');
      return { text: openScope, tokenType: 'ScopeStart' };
    }
   
    context.buffer.skipWhitespace();
    context.popState();
    return { text: '', tokenType: 'Identifier' };
  }
  