import { StateName } from './StateName';

export interface IParserState {
  state: StateName;
  subState: string;

  getDescription(): string;
}
