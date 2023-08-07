import { IParserState, StateName } from '#interfaces/IParserState.js';

export class ParserState implements IParserState {
  state: StateName;

  constructor(other?: IParserState) {
    if (other) {
      this.state = other.state;
    } else {
      this.state = 'Initial';
    }
  }

  getDescription(): string {
    return this.state as string;
  }
}
