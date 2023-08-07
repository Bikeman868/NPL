export enum ParserStates {
  Initial,
  Using,
  Application,
  Network,
}

export interface IParserState {
  state: ParserStates;
}
