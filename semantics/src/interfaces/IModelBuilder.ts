import { ITokenStream } from '#interfaces/ITokenStream.js';

export interface IModelBuilder<T> {
    build(): T;
    addTokens(tokens: ITokenStream, comments: string[]): void;
}
