import { IParserState, ParserStates } from '#interfaces/IParserState.js';

export class ParserState implements IParserState {
  state: ParserStates;

  constructor(other?: IParserState) {
    if (other) {
      this.state = other.state;
    } else {
      this.state = ParserStates.Initial;
    }
  }
}
