import { IParserState } from '#interfaces/IParserState.js';
import { StateName } from '#interfaces/StateName.js';

export class ParserState implements IParserState {
  state: StateName;
  subState: string;

  constructor(other?: IParserState) {
    if (other) {
      this.state = other.state;
      this.subState = other.subState;
    } else {
      this.state = 'sourcefile';
      this.subState = '';
    }
  }

  getDescription(): string {
    return (this.state as string) + '.' + this.subState;
  }
}
